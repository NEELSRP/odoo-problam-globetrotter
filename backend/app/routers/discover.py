from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import City, Activity
from app.schemas.schemas import CityOut, CityCreate, ActivityOut, ActivityCreate

router = APIRouter(prefix="/api", tags=["discover"])


@router.get("/cities", response_model=list[CityOut])
def search_cities(q: str | None = Query(default=None), country: str | None = None, db: Session = Depends(get_db)):
    query = db.query(City)
    if q:
        query = query.filter(City.name.ilike(f"%{q}%"))
    if country:
        query = query.filter(City.country.ilike(f"%{country}%"))
    return query.order_by(City.popularity.desc()).all()


@router.post("/cities", response_model=CityOut)
def create_city(payload: CityCreate, db: Session = Depends(get_db)):
    city = City(**payload.model_dump())
    db.add(city)
    db.commit()
    db.refresh(city)
    return city


@router.get("/cities/{city_id}/activities", response_model=list[ActivityOut])
def city_activities(city_id: int, type: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Activity).filter(Activity.city_id == city_id)
    if type:
        query = query.filter(Activity.type == type)
    return query.all()


@router.post("/activities", response_model=ActivityOut)
def create_activity(payload: ActivityCreate, db: Session = Depends(get_db)):
    activity = Activity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity
