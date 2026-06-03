import sys
import os
from datetime import datetime, timedelta

# Add the parent directory to sys.path to import from 'app'
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from sqlmodel import Session, create_engine, select
from sqlalchemy import text
from app.models.models import Member, Team, Project, Task, TeamMemberLink, User, Module
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
            branch="N/A",
            admission_year=0,
            passout_year=0,
            password_hash=get_password_hash("admin123"),
            is_active=True,
            disabled=False,
        )
        session.add(admin_user)
        session.commit()

        print("--- SEEDING_RECRUITMENT_DRIVE_AND_APPLICATIONS ---")
        from app.models.models import RecruitmentDrive, Application
        drive = RecruitmentDrive(
            id="DRIVE-2026",
            title="SDC Annual Recruitment 2026",
            start_date=datetime.now().date(),
            end_date=(datetime.now() + timedelta(days=30)).date(),
            status="ACTIVE"
        )
        session.add(drive)
        session.commit()

        app1 = Application(
            id="APP-882",
            drive_id="DRIVE-2026",
            name="Alex Karr",
            email="alex.karr@college.edu",
            branch="CSE",
            admission_year=2024,
            passout_year=2028,
            linkedin_url="https://linkedin.com/in/alexkarr",
            github_url="https://github.com/alexkarr",
            status="PENDING"
        )
        app2 = Application(
            id="APP-883",
            drive_id="DRIVE-2026",
            name="Valerie Vane",
            email="valerie.vane@college.edu",
            branch="IT",
            admission_year=2023,
            passout_year=2027,
            linkedin_url="https://linkedin.com/in/valerie",
            github_url="https://github.com/valerie",
            status="PENDING"
        )
        session.add(app1)
        session.add(app2)
        session.commit()

        print("--- CREATING_MOCK_OPERATIVES ---")
        operatives = [
            Member(
                id="MEM-001", name="Abhishek", email="abhishek@sdc.com", branch="Backend Lead",
                role="developer", password_hash=get_password_hash("password123"),
                admission_year=2023, passout_year=2027,
                is_active=True, disabled=False,
                created_at=datetime.strptime("2023-01-15", "%Y-%m-%d")
            ),
            Member(
                id="MEM-002", name="Vaishnavi", email="vaishnavi@sdc.com", branch="UI/UX Designer",
                role="developer", password_hash=get_password_hash("password123"),
                admission_year=2023, passout_year=2027,
                is_active=True, disabled=False,
                created_at=datetime.strptime("2023-02-10", "%Y-%m-%d")
            ),
            Member(
                id="MEM-003", name="Satyam", email="satyam@sdc.com", branch="Cybersecurity Analyst",
                role="developer", password_hash=get_password_hash("password123"),
                admission_year=2023, passout_year=2027,
                is_active=True, disabled=False,
                created_at=datetime.strptime("2023-03-05", "%Y-%m-%d")
            ),
            Member(
                id="MEM-004", name="Vayu", email="vayu@sdc.com", branch="Frontend Developer",
                role="developer", password_hash=get_password_hash("password123"),
                admission_year=2023, passout_year=2027,
                is_active=True, disabled=False,
                created_at=datetime.strptime("2023-05-20", "%Y-%m-%d")
            ),
            Member(
                id="MEM-005", name="Bhavna", email="bhavna@sdc.com", branch="Data Scientist",
                role="developer", password_hash=get_password_hash("password123"),
                admission_year=2023, passout_year=2027,
                is_active=True, disabled=False,
                created_at=datetime.strptime("2023-06-12", "%Y-%m-%d")
            ),
            Member(
                id="MEM-006", name="Akansha", email="akansha@sdc.com", branch="DevOps Engineer",
                role="developer", password_hash=get_password_hash("password123"),
                admission_year=2023, passout_year=2027,
                is_active=True, disabled=False,
                created_at=datetime.strptime("2023-08-01", "%Y-%m-%d")
            ),
            Member(
                id="MEM-007", name="Vighnesh", email="vighnesh@sdc.com", branch="Full Stack Dev",
                role="developer", password_hash=get_password_hash("password123"),
                admission_year=2023, passout_year=2027,
                is_active=True, disabled=False,
                created_at=datetime.strptime("2023-09-15", "%Y-%m-%d")
            ),
            Member(
                id="MEM-008", name="Nivedita", email="nivedita@sdc.com", branch="QA Engineer",
                role="developer", password_hash=get_password_hash("password123"),
                admission_year=2023, passout_year=2027,
                is_active=True, disabled=False,
                created_at=datetime.strptime("2023-10-20", "%Y-%m-%d")
            ),
        ]
        for op in operatives:
            session.add(op)
        session.commit()

        print("--- FORMING_TACTICAL_SQUADS ---")
        teams = [
            Team(id="TEAM-ALPHA", name="Team Alpha", created_by="ROOT-ADMIN"),
            Team(id="TEAM-EPSILON", name="Team Epsilon", created_by="ROOT-ADMIN"),
            Team(id="TEAM-GAMMA", name="Team Gamma", created_by="ROOT-ADMIN"),
        ]
        for team in teams:
            session.add(team)
        session.commit()

        # Link members to teams
        links = [
            TeamMemberLink(id="TML-1", team_id="TEAM-ALPHA", user_id="MEM-001", designation="lead"),
            TeamMemberLink(id="TML-2", team_id="TEAM-ALPHA", user_id="MEM-002", designation="member"),
            TeamMemberLink(id="TML-3", team_id="TEAM-ALPHA", user_id="MEM-003", designation="member"),
            TeamMemberLink(id="TML-4", team_id="TEAM-EPSILON", user_id="MEM-004", designation="lead"),
            TeamMemberLink(id="TML-5", team_id="TEAM-EPSILON", user_id="MEM-005", designation="member"),
            TeamMemberLink(id="TML-6", team_id="TEAM-EPSILON", user_id="MEM-006", designation="member"),
            TeamMemberLink(id="TML-7", team_id="TEAM-EPSILON", user_id="MEM-007", designation="member"),
            TeamMemberLink(id="TML-8", team_id="TEAM-GAMMA", user_id="MEM-008", designation="lead"),
            TeamMemberLink(id="TML-9", team_id="TEAM-GAMMA", user_id="MEM-002", designation="member"),
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
                teamId="TEAM-EPSILON", created_by="ROOT-ADMIN"
            ),
            Project(
                id="PROJ-002", name="Software Development Portal", status="LIVE", 
                type="Web_App",
                deadline=(datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d"),
                teamId="TEAM-ALPHA", created_by="ROOT-ADMIN"
            ),
            Project(
                id="PROJ-003", name="Library Management (Koha)", status="PENDING_ADMIN", 
                type="EdTech",
                deadline=(datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
                teamId="TEAM-GAMMA", created_by="ROOT-ADMIN"
            ),
            Project(
                id="PROJ-004", name="Mephquish Club", status="COMPLETED", 
                type="Social",
                deadline=(datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
                teamId="TEAM-ALPHA", created_by="ROOT-ADMIN"
            ),
        ]
        for proj in projects:
            session.add(proj)
        session.commit()

        print("--- CREATING_PROJECT_MODULES ---")
        modules = [
            # CareNest Modules
            Module(id="MOD-UI-1", project_id="PROJ-001", owner_id="MEM-004", name="UI Layer", description="User Interface Layer"),
            Module(id="MOD-API-1", project_id="PROJ-001", owner_id="MEM-005", name="Core API", description="Backend APIs"),
            Module(id="MOD-SEC-1", project_id="PROJ-001", owner_id="MEM-006", name="Security", description="HIPAA Security compliance"),
            Module(id="MOD-DB-1", project_id="PROJ-001", owner_id="MEM-007", name="Database", description="Relational Database storage"),

            # SDC Portal Modules
            Module(id="MOD-UI-2", project_id="PROJ-002", owner_id="MEM-002", name="UI Layer", description="Portal frontend"),
            Module(id="MOD-API-2", project_id="PROJ-002", owner_id="MEM-001", name="Core API", description="Portal backend APIs"),
            Module(id="MOD-NET-2", project_id="PROJ-002", owner_id="MEM-003", name="Networks", description="V5 Bridge connections"),

            # Library Koha Modules
            Module(id="MOD-FE-3", project_id="PROJ-003", owner_id="MEM-008", name="Frontend", description="Search UI"),
            Module(id="MOD-UX-3", project_id="PROJ-003", owner_id="MEM-002", name="UX Flow", description="Checkout flow"),
        ]
        for mod in modules:
            session.add(mod)
        session.commit()

        print("--- ALLOCATING_MODULES ---")
        # Define tasks to generate progress data
        tasks = [
            # CareNest Tasks (EPSILON)
            Task(id="TSK-001", module_id="MOD-UI-1", assigned_to="MEM-004", created_by="ROOT-ADMIN", title="Patient Dashboard", status="DONE"),
            Task(id="TSK-002", module_id="MOD-API-1", assigned_to="MEM-005", created_by="ROOT-ADMIN", title="Doctor Scheduling", status="DONE"),
            Task(id="TSK-003", module_id="MOD-SEC-1", assigned_to="MEM-006", created_by="ROOT-ADMIN", title="HIPAA Encryption", status="IN_PROGRESS"),
            Task(id="TSK-004", module_id="MOD-DB-1", assigned_to="MEM-007", created_by="ROOT-ADMIN", title="Medical Records", status="TODO"),
            
            # SDC Portal Tasks (ALPHA)
            Task(id="TSK-005", module_id="MOD-UI-2", assigned_to="MEM-002", created_by="ROOT-ADMIN", title="Leaderboard Redesign", status="IN_PROGRESS"),
            Task(id="TSK-006", module_id="MOD-API-2", assigned_to="MEM-001", created_by="ROOT-ADMIN", title="User Registry", status="IN_PROGRESS"),
            Task(id="TSK-007", module_id="MOD-NET-2", assigned_to="MEM-003", created_by="ROOT-ADMIN", title="V5 Bridge Connection", status="TODO"),

            # Library Tasks (GAMMA)
            Task(id="TSK-008", module_id="MOD-FE-3", assigned_to="MEM-008", created_by="ROOT-ADMIN", title="Book Search UI", status="DONE"),
            Task(id="TSK-009", module_id="MOD-UX-3", assigned_to="MEM-002", created_by="ROOT-ADMIN", title="Member Checkout", status="IN_PROGRESS"),
        ]
        for task in tasks:
            session.add(task)
        session.commit()

        print("--- UPLINK_COMPLETE: SYSTEM_POPULATED ---")

if __name__ == "__main__":
    seed_data()
