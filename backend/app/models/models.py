from sqlalchemy import (
    Column, Integer, String, Text, Date, Numeric, ForeignKey, CheckConstraint
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # bcrypt hash

    trips = relationship("Trip", back_populates="owner", cascade="all, delete-orphan")


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    country = Column(String(120), nullable=False)
    cost_index = Column(Numeric(5, 2))
    popularity = Column(Integer, default=0)
    latitude = Column(Numeric(9, 6))
    longitude = Column(Numeric(9, 6))

    activities = relationship("Activity", back_populates="city", cascade="all, delete-orphan")


class Trip(Base):
    __tablename__ = "trips"
    __table_args__ = (CheckConstraint("end_date >= start_date"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    description = Column(Text)
    budget = Column(Numeric(10, 2))

    owner = relationship("User", back_populates="trips")
    stops = relationship("TripStop", back_populates="trip", cascade="all, delete-orphan", order_by="TripStop.start_date")
    expenses = relationship("Expense", back_populates="trip", cascade="all, delete-orphan")


class TripStop(Base):
    __tablename__ = "trip_stops"
    __table_args__ = (CheckConstraint("end_date >= start_date"),)

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    trip = relationship("Trip", back_populates="stops")
    city = relationship("City")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    type = Column(String(50))
    cost = Column(Numeric(10, 2), default=0)
    duration = Column(Numeric(4, 1))  # hours

    city = relationship("City", back_populates="activities")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(50), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)

    trip = relationship("Trip", back_populates="expenses")
