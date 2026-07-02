from sqlmodel import create_engine, Session, select
from app.models.models import User
from app.core.security import get_password_hash
import sys

engine = create_engine('mysql+pymysql://root:root@localhost:3306/sdc_portal')
with Session(engine) as session:
    user = session.exec(select(User).where(User.email == "admin@sdc.com")).first()
    if user:
        user.password_hash = get_password_hash("admin123")
        session.add(user)
        session.commit()
        print("Password reset successfully for admin@sdc.com")
    else:
        print("User not found!")
