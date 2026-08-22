"""Run with: python seed.py  (after the API has created tables at least once)"""
from app.core.database import SessionLocal, Base, engine
from app.models.models import City, Activity

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if not db.query(City).first():
    cities = [
        City(name="Goa", country="India", cost_index=3.2, popularity=95, latitude=15.2993, longitude=74.1240),
        City(name="Jaipur", country="India", cost_index=2.8, popularity=88, latitude=26.9124, longitude=75.7873),
        City(name="Bangkok", country="Thailand", cost_index=3.5, popularity=97, latitude=13.7563, longitude=100.5018),
        City(name="Bali", country="Indonesia", cost_index=3.0, popularity=99, latitude=-8.3405, longitude=115.0920),
        City(name="Paris", country="France", cost_index=8.5, popularity=100, latitude=48.8566, longitude=2.3522),
    ]
    db.add_all(cities)
    db.commit()

    goa = db.query(City).filter_by(name="Goa").first()
    bali = db.query(City).filter_by(name="Bali").first()

    activities = [
        Activity(city_id=goa.id, name="Scuba Diving at Grande Island", type="adventure", cost=2500, duration=3),
        Activity(city_id=goa.id, name="Sunset Cruise", type="leisure", cost=1200, duration=2),
        Activity(city_id=goa.id, name="Old Goa Church Tour", type="sightseeing", cost=300, duration=2),
        Activity(city_id=bali.id, name="Ubud Rice Terrace Trek", type="adventure", cost=1800, duration=4),
        Activity(city_id=bali.id, name="Balinese Cooking Class", type="food", cost=2200, duration=3),
    ]
    db.add_all(activities)
    db.commit()
    print(f"Seeded {len(cities)} cities and {len(activities)} activities.")
else:
    print("Cities already exist, skipping seed.")

db.close()
