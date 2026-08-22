from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


# ---------- Auth / User ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- City ----------
class CityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    country: str
    cost_index: Optional[float] = None
    popularity: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class CityCreate(BaseModel):
    name: str
    country: str
    cost_index: Optional[float] = None
    popularity: Optional[int] = 0
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


# ---------- Activity ----------
class ActivityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    city_id: int
    name: str
    type: Optional[str] = None
    cost: Optional[float] = None
    duration: Optional[float] = None


class ActivityCreate(BaseModel):
    city_id: int
    name: str
    type: Optional[str] = None
    cost: Optional[float] = 0
    duration: Optional[float] = None


# ---------- Trip Stop ----------
class TripStopCreate(BaseModel):
    city_id: int
    start_date: date
    end_date: date


class TripStopOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    city_id: int
    start_date: date
    end_date: date
    city: CityOut


# ---------- Expense ----------
class ExpenseCreate(BaseModel):
    category: str
    amount: float


class ExpenseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category: str
    amount: float


# ---------- Trip ----------
class TripCreate(BaseModel):
    name: str
    start_date: date
    end_date: date
    description: Optional[str] = None
    budget: Optional[float] = None


class TripOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    start_date: date
    end_date: date
    description: Optional[str] = None
    budget: Optional[float] = None
    stops: list[TripStopOut] = []
    expenses: list[ExpenseOut] = []


class TripSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    start_date: date
    end_date: date
    budget: Optional[float] = None
    stop_count: int


# ---------- Budget ----------
class BudgetBreakdown(BaseModel):
    total_budget: Optional[float]
    total_spent: float
    remaining: float
    by_category: dict[str, float]
    is_over_budget: bool


# ---------- AI ----------
class AISuggestRequest(BaseModel):
    destination: str
    days: int
    budget: float
    interests: list[str] = []


class AISuggestedStop(BaseModel):
    day: int
    activity: str
    estimated_cost: float


class AISuggestResponse(BaseModel):
    itinerary: list[AISuggestedStop]
    estimated_total: float
    within_budget: bool
    notes: str
