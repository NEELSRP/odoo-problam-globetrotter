from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Trip, TripStop, Expense, User
from app.schemas.schemas import (
    TripCreate, TripOut, TripSummary, TripStopCreate, TripStopOut,
    ExpenseCreate, ExpenseOut,
)

router = APIRouter(prefix="/api/trips", tags=["trips"])


def _get_owned_trip(trip_id: int, db: Session, user: User) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.get("", response_model=list[TripSummary])
def list_trips(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    trips = db.query(Trip).filter(Trip.user_id == user.id).all()
    return [
        TripSummary(
            id=t.id, name=t.name, start_date=t.start_date, end_date=t.end_date,
            budget=t.budget, stop_count=len(t.stops),
        )
        for t in trips
    ]


@router.post("", response_model=TripOut)
def create_trip(payload: TripCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    trip = Trip(user_id=user.id, **payload.model_dump())
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _get_owned_trip(trip_id, db, user)


@router.put("/{trip_id}", response_model=TripOut)
def update_trip(trip_id: int, payload: TripCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    trip = _get_owned_trip(trip_id, db, user)
    for key, value in payload.model_dump().items():
        setattr(trip, key, value)
    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    trip = _get_owned_trip(trip_id, db, user)
    db.delete(trip)
    db.commit()


# ---------- Stops ----------
@router.post("/{trip_id}/stops", response_model=TripStopOut)
def add_stop(trip_id: int, payload: TripStopCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_owned_trip(trip_id, db, user)
    stop = TripStop(trip_id=trip_id, **payload.model_dump())
    db.add(stop)
    db.commit()
    db.refresh(stop)
    return stop


@router.delete("/{trip_id}/stops/{stop_id}", status_code=204)
def delete_stop(trip_id: int, stop_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_owned_trip(trip_id, db, user)
    stop = db.query(TripStop).filter(TripStop.id == stop_id, TripStop.trip_id == trip_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    db.delete(stop)
    db.commit()


# ---------- Expenses ----------
@router.post("/{trip_id}/expenses", response_model=ExpenseOut)
def add_expense(trip_id: int, payload: ExpenseCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_owned_trip(trip_id, db, user)
    expense = Expense(trip_id=trip_id, **payload.model_dump())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{trip_id}/expenses/{expense_id}", status_code=204)
def delete_expense(trip_id: int, expense_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _get_owned_trip(trip_id, db, user)
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.trip_id == trip_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
