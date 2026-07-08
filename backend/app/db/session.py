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
    # Import ALL models so SQLModel.metadata knows every table
    from ..models.models import (
        SystemSetting, File, User, Team, TeamMember,
        Project, ProjectPhase, ProjectDocument, Task,
        Notice, Announcement, Notification, AuditLog,
        Application, Interview, Interaction
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Seed root admin
        user = session.exec(select(User).where(User.email == "admin@sdc.com")).first()
        if not user:
            admin_user = User(
                id="ROOT-ADMIN",
                email="admin@sdc.com",
                name="SDC_ROOT_ADMIN",
                role="admin",
                branch="N/A",
                admission_year=0,
                passout_year=0,
                membership_status="active",
                is_active=True,
                password_hash=get_password_hash("admin123"),
            )
            session.add(admin_user)

        # Seed system settings
        for key, val, desc in [
            ("is_recruitment_live", "false", "Controls public recruitment form visibility"),
            ("academic_year", "2025-26", "Current academic year"),
            ("alumni_conversion_day", "07-31", "Annual alumni conversion date MM-DD"),
        ]:
            s = session.exec(select(SystemSetting).where(SystemSetting.key == key)).first()
            if not s:
                session.add(SystemSetting(key=key, value=val, description=desc))

        session.commit()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
