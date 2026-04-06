from sqlmodel import create_engine, Session, SQLModel, select
from typing import Generator
import os
from ..core.config import settings
from ..core.security import get_password_hash

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

def init_db():
    from ..models.models import User # Import models to register them
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == "admin@sdc.com")).first()
        if not user:
            admin_user = User(
                id="ROOT-ADMIN",
                email="admin@sdc.com",
                name="SDC_ROOT_ADMIN",
                role="admin",
                hashed_password=get_password_hash("admin123"),
            )
            session.add(admin_user)
            session.commit()

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
