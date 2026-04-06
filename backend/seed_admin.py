import os
import sys
from sqlmodel import Session, create_engine, select
from datetime import datetime

# Adjust path to import from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "app")))

from app.models.models import User
from sqlmodel import SQLModel, create_engine, Session, select
from app.core.security import get_password_hash
from app.core.config import settings

def seed_admin_protocol():
    engine = create_engine(settings.DATABASE_URL)
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Check if admin already exists
        statement = select(User).where(User.role == "admin")
        admin = session.exec(statement).first()
        
        if admin:
            print(f"[-] Admin entity already detected: {admin.email}")
            return
        
        # Identity Manifest
        admin_data = User(
            id="SDC-ADMIN-01",
            email="admin@sdc.portal",
            name="SDC Mainframe Admin",
            role="admin",
            hashed_password=get_password_hash("SDC@ADMIN_2026") # Secure default
        )
        
        session.add(admin_data)
        session.commit()
        print(f"[+] Admin Access Protocol: INITIALIZED")
        print(f"Email: {admin_data.email}")
        print(f"Password: SDC@ADMIN_2026")
        print(f"ID: {admin_data.id}")

if __name__ == "__main__":
    seed_admin_protocol()
