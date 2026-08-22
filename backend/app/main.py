from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.models import models  # noqa: F401 - registers models on Base
from app.routers import auth, trips, discover, budget, ai, shared, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GlobeTrotter API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(discover.router)
app.include_router(budget.router)
app.include_router(ai.router)
app.include_router(shared.router)
app.include_router(users.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
