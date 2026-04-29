"""
Database configuration and session management
Supports both SQLite (local dev) and PostgreSQL (Supabase production)
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool, QueuePool, StaticPool
from app.config import settings

# Database URL - supports both sqlite:// and postgresql://
DATABASE_URL = settings.database_url or "sqlite:///./qurly.db"

# Determine database type and create engine accordingly
is_postgresql = "postgresql" in DATABASE_URL

if is_postgresql:
    # PostgreSQL configuration (Supabase, etc.)
    # Use psycopg2 driver for best compatibility
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
    
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,  # Verify connection before using
        pool_recycle=3600,   # Recycle connections every hour
        echo=False,
    )
else:
    # SQLite configuration (local development)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False,
    )

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
