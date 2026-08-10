import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.db.session import engine, init_db
from app.models.models import User, Application, Project, Team, Task, TeamMember
from sqlmodel import Session, select

def purge_tidb():
    print("[*] Connecting directly to TiDB Engine:", engine.url)
    init_db()
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        print(f"[STATUS] Total users remaining in TiDB Cloud DB: {len(users)}")
        for u in users:
            print(f"  -> User ID: {u.id} | Name: {u.name} | Email: {u.email} | Role: {u.role}")

if __name__ == "__main__":
    purge_tidb()
