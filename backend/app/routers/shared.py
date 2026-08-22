from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Trip
from app.schemas.schemas import TripOut

router = APIRouter(prefix="/api/shared", tags=["shared"])


@router.get("/trips/{trip_id}", response_model=TripOut)
def view_shared_trip(trip_id: int, db: Session = Depends(get_db)):
    """Read-only public view of a trip (no auth required)."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip
