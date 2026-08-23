from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings


def _clean_database_url(url: str) -> str:
    """
    psycopg2 doesn't understand some query params that Supabase/Prisma-style
    connection strings include (e.g. ?pgbouncer=true). Strip anything psycopg2
    can't parse so the app doesn't crash on startup regardless of exactly which
    connection string was copied from the Supabase dashboard.
    """
    parts = urlsplit(url)
    if not parts.query:
        return url

    UNSUPPORTED_PARAMS = {"pgbouncer"}
    kept = [(k, v) for k, v in parse_qsl(parts.query) if k not in UNSUPPORTED_PARAMS]
    new_query = urlencode(kept)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, new_query, parts.fragment))


database_url = _clean_database_url(settings.database_url)

connect_args = {}
if "supabase.co" in database_url or "supabase.com" in database_url:
    connect_args = {"sslmode": "require"}

engine = create_engine(database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()