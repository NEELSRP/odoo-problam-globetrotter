"""
Implements the flow:

  Enter Requirements (destination, days, budget, interests)
        -> AI generates a suggested itinerary
        -> Budget Engine checks estimated cost vs budget
        -> UNDER budget -> approve as-is
        -> OVER budget  -> ask the AI to optimize toward cheaper options
        -> return FINAL ITINERARY
"""
import json

import httpx
from fastapi import APIRouter, Depends, HTTPException

from app.core.config import settings
from app.core.security import get_current_user
from app.models.models import User
from app.schemas.schemas import AISuggestRequest, AISuggestResponse, AISuggestedStop

router = APIRouter(prefix="/api/ai", tags=["ai"])

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent"
)


def _build_prompt(req: AISuggestRequest, optimize: bool = False) -> str:
    interests = ", ".join(req.interests) if req.interests else "general sightseeing"
    base = (
        f"Create a {req.days}-day travel itinerary for {req.destination}. "
        f"Traveler budget: {req.budget}. Interests: {interests}. "
    )
    if optimize:
        base += (
            "The previous plan went over budget. Suggest CHEAPER alternative "
            "activities to bring the total under budget. "
        )
    base += (
        'Respond ONLY with JSON, no markdown fences, in this exact shape: '
        '{"itinerary": [{"day": 1, "activity": "...", "estimated_cost": 0}], '
        '"notes": "one short sentence"}'
    )
    return base


async def _call_gemini(prompt: str) -> dict:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="Gemini API key not configured on server")

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{GEMINI_URL}?key={settings.gemini_api_key}",
            json={"contents": [{"parts": [{"text": prompt}]}]},
        )
    resp.raise_for_status()
    data = resp.json()
    text = data["candidates"][0]["content"]["parts"][0]["text"]
    cleaned = text.replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)


@router.post("/suggest-itinerary", response_model=AISuggestResponse)
async def suggest_itinerary(payload: AISuggestRequest, user: User = Depends(get_current_user)):
    # 1. Ask AI for an initial itinerary
    raw = await _call_gemini(_build_prompt(payload))
    stops = [AISuggestedStop(**s) for s in raw.get("itinerary", [])]
    total = sum(s.estimated_cost for s in stops)

    # 2. Budget Engine check
    within_budget = total <= payload.budget
    notes = raw.get("notes", "")

    # 3. If over budget, ask AI to optimize once toward cheaper options
    if not within_budget:
        raw = await _call_gemini(_build_prompt(payload, optimize=True))
        stops = [AISuggestedStop(**s) for s in raw.get("itinerary", [])]
        total = sum(s.estimated_cost for s in stops)
        within_budget = total <= payload.budget
        notes = raw.get("notes", notes)

    return AISuggestResponse(
        itinerary=stops,
        estimated_total=round(total, 2),
        within_budget=within_budget,
        notes=notes,
    )
