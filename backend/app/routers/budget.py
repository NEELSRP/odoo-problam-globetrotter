from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Trip, User
from app.routers.trips import _get_owned_trip
from app.schemas.schemas import BudgetBreakdown

router = APIRouter(prefix="/api/trips", tags=["budget"])


@router.get("/{trip_id}/budget", response_model=BudgetBreakdown)
def get_budget_breakdown(trip_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    trip = _get_owned_trip(trip_id, db, user)

    by_category: dict[str, float] = {}
    total_spent = 0.0
    for expense in trip.expenses:
        amount = float(expense.amount)
        by_category[expense.category] = by_category.get(expense.category, 0.0) + amount
        total_spent += amount

    total_budget = float(trip.budget) if trip.budget is not None else None
    remaining = (total_budget - total_spent) if total_budget is not None else None
    is_over_budget = total_budget is not None and total_spent > total_budget

    return BudgetBreakdown(
        total_budget=total_budget,
        total_spent=round(total_spent, 2),
        remaining=round(remaining, 2) if remaining is not None else None,
        by_category={k: round(v, 2) for k, v in by_category.items()},
        is_over_budget=is_over_budget,
    )
