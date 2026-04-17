import sys
import os

# Add the backend directory to sys.path to allow imports from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine, init_db
from sqlmodel import SQLModel

def recreate_database():
    print("WARNING: All data will be deleted. Proceeding...")
    # Register all models
    from app.models.models import User, Member, Team, Project, Task, Application, Announcement, Setting, HallOfEchoes
    
    # Drop all tables
    SQLModel.metadata.drop_all(engine)
    print("Old tables purged.")
    
    # Recreate tables and add root admin
    init_db()
    print("Database recreated with root admin initialized.")

if __name__ == "__main__":
    recreate_database()
