# GlobeTrotter

Personalized, multi-city travel planning app.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Auth | JWT (python-jose + passlib/bcrypt) |
| Maps | OpenStreetMap (via Leaflet, `react-leaflet` installed and ready to use) |
| AI | Gemini API (itinerary + budget suggestions) |
| Version control | Git + GitHub |
| Local dev | Docker Compose (Postgres + backend + frontend) |

## Quick start (Docker — recommended)

```bash
cp backend/.env.example backend/.env
# edit backend/.env and add your GEMINI_API_KEY if you want AI suggestions to work

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs
- Postgres: localhost:5432 (user/pass: postgres/postgres)

Seed some sample cities & activities (optional, run once the containers are up):

```bash
docker compose exec backend python seed.py
```

## Quick start (without Docker)

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # point DATABASE_URL at your local Postgres
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Project structure

```
globetrotter/
├── backend/
│   ├── app/
│   │   ├── core/        # config, db session, JWT/password auth
│   │   ├── models/       # SQLAlchemy models (users, trips, cities, trip_stops, activities, expenses)
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── routers/      # auth, trips, discover (cities/activities), budget, ai, shared
│   │   └── main.py
│   ├── seed.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/        # Login, Signup, Dashboard, MyTrips, CreateTrip, TripDetail, Discover, SharedTrip
│   │   ├── components/   # NavBar, ProtectedRoute
│   │   ├── context/      # AuthContext (JWT stored in localStorage)
│   │   └── lib/api.js    # axios client
│   ├── tailwind.config.js
│   └── Dockerfile
└── docker-compose.yml
```

## Core flows implemented

- **Auth**: signup / login issue a JWT; frontend stores it and attaches it as a Bearer token on every request.
- **Trip → Stops → Cities**: itinerary builder lets you add ordered city stops with arrival/departure dates.
- **Calendar / Timeline**: day-by-day view of the trip, generated from the stop date ranges.
- **Map**: Leaflet + OpenStreetMap view plotting each stop by city lat/lng with a dashed route line between them.
- **Budget Engine**: `/api/trips/{id}/budget` totals expenses by category against the trip's budget and flags over-budget.
- **AI Suggestions**: `/api/ai/suggest-itinerary` calls Gemini for a day-by-day plan; if the estimated cost exceeds the budget, it automatically asks Gemini once more for a cheaper version before returning the final itinerary (matches the requirements → AI → budget check → approve/optimize flow).
- **Sharing**: any trip has a public read-only view at `/shared/:tripId`, no login required.
- **Profile / Settings**: update name/email/password, or delete the account entirely.

## Screens vs. original brief

All 12 required screens are implemented; only the optional Admin/Analytics dashboard (#13) is not built.

| # | Screen | Status |
|---|---|---|
| 1 | Login / Signup | ✅ |
| 2 | Dashboard / Home | ✅ |
| 3 | Create Trip | ✅ |
| 4 | My Trips | ✅ |
| 5 | Itinerary Builder | ✅ |
| 6 | Itinerary View (calendar/list) | ✅ |
| 7 | City Search | ✅ (Discover) |
| 8 | Activity Search | ✅ (Discover, per city) |
| 9 | Trip Budget & Cost Breakdown | ✅ |
| 10 | Trip Calendar / Timeline | ✅ |
| 11 | Shared / Public Itinerary View | ✅ |
| 12 | User Profile / Settings | ✅ |
| 13 | Admin / Analytics Dashboard | ⬜ optional, not built |

## Design direction

The UI leans into a "travel journal / passport" identity rather than a generic dashboard look: deep ink-navy + warm stamp-red palette, a serif display face (Fraunces) for trip names, a perforated "ticket" card edge, and itinerary stops rendered as passport-stamp badges connected by a dashed route line.

## Troubleshooting

**Signup/login fails with "Could not sign up" / "Could not log in"**
Open the browser dev tools → Network tab and check the failed request:
- If the `/api/auth/signup` request never completes (network error, not a 4xx/5xx) — the frontend can't reach the backend. Inside Docker Compose this usually means the Vite dev proxy is pointing at `localhost:8000` instead of the backend *container*. This repo sets `VITE_API_PROXY_TARGET=http://backend:8000` in `docker-compose.yml` for exactly this reason — if you changed the compose file or run frontend/backend containers separately, make sure that env var (or `vite.config.js`'s default) points at wherever your backend actually is.
- If you get a `422`, check the request payload matches `{name, email, password}`.
- If you get a `500`, check `docker compose logs backend` — usually a database connection issue (Postgres not up yet, or `DATABASE_URL` wrong).
- Confirm the backend is actually reachable: `curl http://localhost:8000/api/health` should return `{"status":"ok"}`.

## Notes

- `GEMINI_API_KEY` must be set in `backend/.env` for the AI Suggestions tab to work — without it, that endpoint returns a 503.
- The map only plots cities that have latitude/longitude set. The five seeded cities include coordinates; cities you add yourself via `/api/cities` should include `latitude`/`longitude` to appear on the map.
- No image upload yet for trip cover photos (mentioned in the original brief as optional).
