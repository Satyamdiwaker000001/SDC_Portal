import os
import sys
from datetime import datetime
from sqlmodel import Session, select

# Add backend dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine
from app.models.models import User
from app.core import security

def create_admin():
    print("--- SDC Portal Admin Seeder ---")
    email = input("Enter admin email (default: admin@sdc.com): ") or "admin@sdc.com"
    name = input("Enter admin name (default: Admin User): ") or "Admin User"
    password = input("Enter password (default: SDCAdmin@2026): ") or "SDCAdmin@2026"
    
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == email)).first()
        if existing:
            print(f"User with email {email} already exists!")
            return
            
        admin_user = User(
            id=f"USR-{int(datetime.utcnow().timestamp())}",
            name=name,
            email=email,
            password_hash=security.get_password_hash(password),
            role="admin",
            branch="N/A",
            admission_year=0,
            passout_year=0,
            is_active=True,
            is_retired=False,
            created_at=datetime.utcnow()
        )
        session.add(admin_user)
        session.commit()
        print(f"Successfully created admin user: {email}")

if __name__ == "__main__":
    create_admin()
