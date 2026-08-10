import sys
import os
import sqlite3

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from sqlmodel import Session, SQLModel, select, create_engine
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.models import (
    User, Team, TeamMember, Project, ProjectPhase, 
    ProjectDocument, Task, Notice, Announcement, 
    Notification, AuditLog, Application, SystemSetting
)

def reset_engine(url, ca_path=None):
    print(f"[*] Resetting Database: {url}")
    connect_args = {}
    if "sqlite" in url:
        connect_args = {"check_same_thread": False}
    elif "mysql" in url:
        if not ca_path:
            try:
                import certifi
                ca_path = certifi.where()
            except ImportError:
                ca_path = None
        if ca_path:
            connect_args = {"ssl": {"ca": ca_path}}

    engine = create_engine(url, pool_pre_ping=True, connect_args=connect_args)
    try:
        SQLModel.metadata.drop_all(engine)
    except Exception as e:
        print("  Drop error:", e)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Seed root admin
        admin = User(
            id="USR-ADMIN-ROOT",
            name="SDC Root Administrator",
            email="admin@sdc.edu",
            password_hash=get_password_hash("admin@sdc!@#"),
            role="admin",
            branch="Administration",
            admission_year=2024,
            passout_year=2028,
            sdc_joining_year=2024,
            membership_status="active",
            is_active=True
        )
        session.add(admin)
        
        # System settings
        session.add(SystemSetting(key="is_recruitment_live", value="true", description="Recruitment Live Switch"))
        session.add(SystemSetting(key="recruitment_open_for", value="All Roles", description="Recruitment Target Category"))
        session.commit()
    print(f"[SUCCESS] Wiped all non-admin data for {url}. ONLY admin@sdc.edu exists now.")

if __name__ == "__main__":
    # 1. Reset Remote TiDB Cloud DB
    try:
        reset_engine(settings.DATABASE_URL, settings.DB_CA_PATH)
    except Exception as err:
        print("[!] Remote TiDB reset error:", err)

    # 2. Reset Local SQLite DB
    try:
        reset_engine("sqlite:///./sdc_portal.db")
    except Exception as err:
        print("[!] Local SQLite reset error:", err)
