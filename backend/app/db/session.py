from sqlmodel import create_engine, Session, SQLModel, select
from sqlalchemy import text
from typing import Generator
import os
from ..core.config import settings
from ..core.security import get_password_hash

DATABASE_URL = settings.DATABASE_URL

def build_engine(url: str):
    connect_args = {}
    if "sqlite" in url:
        connect_args = {"check_same_thread": False}
    elif "mysql" in url:
        ca_path = settings.DB_CA_PATH
        if not ca_path:
            try:
                import certifi
                ca_path = certifi.where()
            except ImportError:
                ca_path = None
        if ca_path:
            connect_args = {"ssl": {"ca": ca_path}}
    return create_engine(url, pool_pre_ping=True, connect_args=connect_args)

engine = build_engine(DATABASE_URL)

def init_db():
    global engine, DATABASE_URL
    # Import ALL models so SQLModel.metadata knows every table
    from ..models.models import (
        SystemSetting, File, User, Team, TeamMember,
        Project, ProjectPhase, ProjectDocument, Task,
        Notice, Announcement, Notification, AuditLog,
        Application, Interview, Interaction
    )

    try:
        SQLModel.metadata.create_all(engine)
        with Session(engine) as session:
            session.exec(select(User)).first()
    except Exception as err:
        print(f"[WARN] Unable to connect to remote DB ({err}). Switching to local SQLite database.")
        DATABASE_URL = "sqlite:///./sdc_portal.db"
        engine = build_engine(DATABASE_URL)
        SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        with session.no_autoflush:
            # Disable foreign key checks for clean MySQL / TiDB purge if using MySQL
            if "mysql" in str(engine.url):
                try:
                    session.exec(text("SET FOREIGN_KEY_CHECKS = 0;"))
                except Exception:
                    pass

            # Purge all non-admin mock seed users, teams, projects, tasks, applications, notifications, audit logs
            for table_name in [
                "notifications", "audit_log", "interactions", "interviews",
                "notices", "announcements", "tasks", "project_documents",
                "project_phases", "projects", "team_members", "teams", "applications"
            ]:
                try:
                    session.exec(text(f"DELETE FROM `{table_name}`;"))
                except Exception:
                    pass

            try:
                session.exec(text("DELETE FROM `users` WHERE role != 'admin';"))
            except Exception:
                pass

            if "mysql" in str(engine.url):
                try:
                    session.exec(text("SET FOREIGN_KEY_CHECKS = 1;"))
                except Exception:
                    pass

            session.commit()

        # Seed/update root admin with requested secure password and admin@sdc.edu domain
        user = session.exec(select(User).where((User.email == "admin@sdc.edu") | (User.email == "admin@sdc.com"))).first()
        if not user:
            admin_user = User(
                id="ROOT-ADMIN",
                email="admin@sdc.edu",
                name="SDC_ROOT_ADMIN",
                role="admin",
                branch="N/A",
                admission_year=0,
                passout_year=0,
                membership_status="active",
                is_active=True,
                password_hash=get_password_hash("admin@sdc!@#"),
            )
            session.add(admin_user)
        else:
            user.email = "admin@sdc.edu"
            user.password_hash = get_password_hash("admin@sdc!@#")
            session.add(user)

        # Seed system settings
        for key, val, desc in [
            ("is_recruitment_live", "true", "Controls public recruitment form visibility"),
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

