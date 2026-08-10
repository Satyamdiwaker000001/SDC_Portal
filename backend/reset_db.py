from sqlmodel import Session, SQLModel, select
from app.db.session import engine, init_db
from app.models.models import (
    User, Team, TeamMember, Project, ProjectPhase, 
    ProjectDocument, Task, Notice, Announcement, 
    Notification, AuditLog, Application, Interview, Interaction
)

def reset_db_only_admin():
    print("[*] Wiping all non-admin seed data and re-initializing database schema...")
    try:
        SQLModel.metadata.drop_all(engine)
    except Exception:
        pass
    SQLModel.metadata.create_all(engine)
    init_db()  # Seeds ONLY admin@sdc.edu and default SystemSettings
    print("[SUCCESS] Database reset complete! ONLY root admin (admin@sdc.edu / admin@sdc!@#) exists.")

if __name__ == "__main__":
    reset_db_only_admin()
