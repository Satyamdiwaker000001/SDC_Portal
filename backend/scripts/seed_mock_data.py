import sys
import os
from datetime import datetime, timedelta

# Add the parent directory to sys.path to import from 'app'
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from sqlmodel import Session, create_engine, select
from sqlalchemy import text
from app.models.models import Member, Team, Project, Task, TeamMemberLink, User
from app.core.config import settings
from app.core.security import get_password_hash

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def seed_data():
    with Session(engine) as session:
        print("--- REBOOTING_DATABASE_SCHEMA ---")
        from app.models.models import SQLModel
        SQLModel.metadata.drop_all(engine)
        SQLModel.metadata.create_all(engine)
        
        # Create Root Admin User
        admin_user = User(
            id="ROOT-ADMIN",
            email="admin@sdc.com",
            name="SDC_ROOT_ADMIN",
            role="admin",
            hashed_password=get_password_hash("admin123"), # Need this import
        )
        session.add(admin_user)
        session.commit()

        print("--- CREATING_MOCK_OPERATIVES ---")
        operatives = [
            Member(id="MEM-001", name="Abhishek", email="abhishek@sdc.com", spec="Backend Lead", joinDate="2023-01-15", status="ACTIVE", techStack=["Python", "FastAPI", "PostgreSQL"]),
            Member(id="MEM-002", name="Vaishnavi", email="vaishnavi@sdc.com", spec="UI/UX Designer", joinDate="2023-02-10", status="ACTIVE", techStack=["React", "Figma", "Tailwind"]),
            Member(id="MEM-003", name="Satyam", email="satyam@sdc.com", spec="Cybersecurity Analyst", joinDate="2023-03-05", status="ACTIVE", techStack=["Go", "Vulnerability Scanning", "Networks"]),
            Member(id="MEM-004", name="Vayu", email="vayu@sdc.com", spec="Frontend Developer", joinDate="2023-05-20", status="ACTIVE", techStack=["Vue.js", "Three.js"]),
            Member(id="MEM-005", name="Bhavna", email="bhavna@sdc.com", spec="Data Scientist", joinDate="2023-06-12", status="ACTIVE", techStack=["Python", "PyTorch", "Pandas"]),
            Member(id="MEM-006", name="Akansha", email="akansha@sdc.com", spec="DevOps Engineer", joinDate="2023-08-01", status="ACTIVE", techStack=["Docker", "K8s", "CI/CD"]),
            Member(id="MEM-007", name="Vighnesh", email="vighnesh@sdc.com", spec="Full Stack Dev", joinDate="2023-09-15", status="ACTIVE", techStack=["Next.js", "Node.js", "Prisma"]),
            Member(id="MEM-008", name="Nivedita", email="nivedita@sdc.com", spec="QA Engineer", joinDate="2023-10-20", status="ACTIVE", techStack=["Selenium", "Jest", "Cypress"]),
        ]
        for op in operatives:
            session.add(op)
        session.commit()

        print("--- FORMING_TACTICAL_SQUADS ---")
        teams = [
            Team(id="TEAM-ALPHA", name="Team Alpha", leaderId="MEM-001"),
            Team(id="TEAM-EPSILON", name="Team Epsilon", leaderId="MEM-004"),
            Team(id="TEAM-GAMMA", name="Team Gamma", leaderId="MEM-008"),
        ]
        for team in teams:
            session.add(team)
        session.commit()

        # Link members to teams
        links = [
            TeamMemberLink(team_id="TEAM-ALPHA", member_id="MEM-001"),
            TeamMemberLink(team_id="TEAM-ALPHA", member_id="MEM-002"),
            TeamMemberLink(team_id="TEAM-ALPHA", member_id="MEM-003"),
            TeamMemberLink(team_id="TEAM-EPSILON", member_id="MEM-004"),
            TeamMemberLink(team_id="TEAM-EPSILON", member_id="MEM-005"),
            TeamMemberLink(team_id="TEAM-EPSILON", member_id="MEM-006"),
            TeamMemberLink(team_id="TEAM-EPSILON", member_id="MEM-007"),
            TeamMemberLink(team_id="TEAM-GAMMA", member_id="MEM-008"),
            TeamMemberLink(team_id="TEAM-GAMMA", member_id="MEM-002"), # Shared designers
        ]
        for link in links:
            session.add(link)
        session.commit()

        print("--- DEPLOYING_MISSIONS ---")
        projects = [
            Project(
                id="PROJ-001", name="CareNest (DR Hospital)", status="LIVE", 
                type="HealthTech",
                deadline=(datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"),
                progress=53, teamId="TEAM-EPSILON"
            ),
            Project(
                id="PROJ-002", name="Software Development Portal", status="LIVE", 
                type="Web_App",
                deadline=(datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d"),
                progress=18, teamId="TEAM-ALPHA"
            ),
            Project(
                id="PROJ-003", name="Library Management (Koha)", status="PENDING_ADMIN", 
                type="EdTech",
                deadline=(datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
                progress=48, teamId="TEAM-GAMMA"
            ),
            Project(
                id="PROJ-004", name="Mephquish Club", status="COMPLETED", 
                type="Social",
                deadline=(datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
                progress=100, teamId="TEAM-ALPHA"
            ),
        ]
        for proj in projects:
            session.add(proj)
        session.commit()

        print("--- ALLOCATING_MODULES ---")
        # Define tasks to generate progress data
        tasks = [
            # CareNest Tasks (EPSILON)
            Task(id="TSK-001", moduleName="UI_LAYER", title="Patient Dashboard", assignedTo="MEM-004", status="DONE", progress=100, project_id="PROJ-001"),
            Task(id="TSK-002", moduleName="CORE_API", title="Doctor Scheduling", assignedTo="MEM-005", status="DONE", progress=100, project_id="PROJ-001"),
            Task(id="TSK-003", moduleName="SECURITY", title="HIPAA Encryption", assignedTo="MEM-006", status="IN_PROGRESS", progress=40, project_id="PROJ-001"),
            Task(id="TSK-004", moduleName="DATABASE", title="Medical Records", assignedTo="MEM-007", status="TODO", progress=0, project_id="PROJ-001"),
            
            # SDC Portal Tasks (ALPHA)
            Task(id="TSK-005", moduleName="UI_LAYER", title="Leaderboard Redesign", assignedTo="MEM-002", status="IN_PROGRESS", progress=90, project_id="PROJ-002"),
            Task(id="TSK-006", moduleName="CORE_API", title="User Registry", assignedTo="MEM-001", status="IN_PROGRESS", progress=20, project_id="PROJ-002"),
            Task(id="TSK-007", moduleName="NETWORKS", title="V5 Bridge Connection", assignedTo="MEM-003", status="TODO", progress=0, project_id="PROJ-002"),

            # Library Tasks (GAMMA)
            Task(id="TSK-008", moduleName="FRONTEND", title="Book Search UI", assignedTo="MEM-008", status="DONE", progress=100, project_id="PROJ-003"),
            Task(id="TSK-009", moduleName="UX_FLOW", title="Member Checkout", assignedTo="MEM-002", status="IN_PROGRESS", progress=40, project_id="PROJ-003"),
        ]
        for task in tasks:
            session.add(task)
        session.commit()

        print("--- UPLINK_COMPLETE: SYSTEM_POPULATED ---")

if __name__ == "__main__":
    seed_data()
