from sqlmodel import Session, select
from app.models.models import User
from app.core.security import get_password_hash
import sys
from app.db.session import engine
with Session(engine) as session:
    user = session.exec(select(User).where((User.email == "admin@sdc.edu") | (User.email == "admin@sdc.com"))).first()
    if user:
        user.email = "admin@sdc.edu"
        user.password_hash = get_password_hash("admin@sdc!@#")
        session.add(user)
        session.commit()
        print("Password reset successfully for admin@sdc.edu")
    else:
        print("User not found!")
