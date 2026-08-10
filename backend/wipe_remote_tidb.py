import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from sqlmodel import Session, SQLModel, select
from app.db.session import engine, init_db
from app.models.models import User, Team, TeamMember, Project, ProjectPhase, Task, Application, AuditLog

def wipe_and_reset():
    print("[*] Connecting to Database engine:", engine.url)
    print("[*] Wiping ALL non-admin records from remote database...")
    try:
        SQLModel.metadata.drop_all(engine)
        print("[*] Successfully dropped all remote tables.")
    except Exception as e:
        print("[!] Drop table exception:", e)

    SQLModel.metadata.create_all(engine)
    print("[*] Successfully recreated remote database schema.")

    init_db()  # Seeds ONLY admin@sdc.edu / admin@sdc!@#
    print("[SUCCESS] Database completely wiped and reset! ONLY admin@sdc.edu exists now.")

if __name__ == "__main__":
    wipe_and_reset()
