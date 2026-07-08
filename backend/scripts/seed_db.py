import sys
import os
from datetime import datetime, timedelta

# Add the backend directory to sys.path to allow imports from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine, init_db
from app.models.models import User, Team, TeamMember, Project, ProjectPhase, ProjectDocument, Task, SystemSetting
from app.core.security import get_password_hash
from sqlmodel import Session, select, SQLModel

def seed_premium_data():
    print("Reinitializing database...")
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    init_db() # Seeds admin@sdc.com and default system settings
    
    with Session(engine) as session:
        print("Seeding real SDC Cell members...")
        
        # 1. Mentor
        mentor = User(
            id="USR-MENTOR",
            name="Mr. Prateek Agrawal",
            email="mentor@sdc.com",
            password_hash=get_password_hash("password123"),
            role="mentor",
            branch="Computer Science",
            admission_year=0,
            passout_year=0,
            is_active=True,
            membership_status="active",
            profile_image="https://api.dicebear.com/7.x/avataaars/svg?seed=Prateek"
        )
        session.add(mentor)
        
        # 2. Lead Developers & Developers (The Operatives)
        satyam = User(
            id="USR-SATYAM",
            name="Satyam Diwaker",
            email="satyam@sdc.com",
            password_hash=get_password_hash("password123"),
            role="developer",
            branch="Computer Science",
            admission_year=2023,
            passout_year=2027,
            is_active=True,
            membership_status="active",
            profile_image="https://api.dicebear.com/7.x/avataaars/svg?seed=Satyam"
        )
        session.add(satyam)
        
        aryan = User(
            id="USR-ARYAN",
            name="Aryan Raj",
            email="aryan@sdc.com",
            password_hash=get_password_hash("password123"),
            role="developer",
            branch="Computer Science",
            admission_year=2023,
            passout_year=2027,
            is_active=True,
            membership_status="active",
            profile_image="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan"
        )
        session.add(aryan)
        
        ananya = User(
            id="USR-ANANYA",
            name="Ananya Singh",
            email="ananya@sdc.com",
            password_hash=get_password_hash("password123"),
            role="developer",
            branch="Information Technology",
            admission_year=2024,
            passout_year=2028,
            is_active=True,
            membership_status="active",
            profile_image="https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
        )
        session.add(ananya)
        
        rohan = User(
            id="USR-ROHAN",
            name="Rohan Gupta",
            email="rohan@sdc.com",
            password_hash=get_password_hash("password123"),
            role="developer",
            branch="Computer Science",
            admission_year=2024,
            passout_year=2028,
            is_active=True,
            membership_status="active",
            profile_image="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
        )
        session.add(rohan)
        
        session.commit()
        
        # 3. Teams (The Squads)
        t1 = Team(id="TEAM-ALPHA", name="PhishGuard Ops", created_by="ROOT-ADMIN")
        t2 = Team(id="TEAM-BETA", name="Portal Architects", created_by="ROOT-ADMIN")
        session.add_all([t1, t2])
        session.commit()
        
        # 4. Link Members to Teams (Ensuring BR-003: developer in only one active team)
        # TEAM-ALPHA (Satyam as lead, Rohan as member, Mr. Prateek as mentor)
        session.add(TeamMember(id="TM-ALPHA-MENTOR", team_id="TEAM-ALPHA", user_id="USR-MENTOR", designation="mentor"))
        session.add(TeamMember(id="TM-ALPHA-LEAD", team_id="TEAM-ALPHA", user_id="USR-SATYAM", designation="lead"))
        session.add(TeamMember(id="TM-ALPHA-MEM1", team_id="TEAM-ALPHA", user_id="USR-ROHAN", designation="member"))
        
        # TEAM-BETA (Aryan as lead, Ananya as member, Mr. Prateek as mentor)
        session.add(TeamMember(id="TM-BETA-MENTOR", team_id="TEAM-BETA", user_id="USR-MENTOR", designation="mentor"))
        session.add(TeamMember(id="TM-BETA-LEAD", team_id="TEAM-BETA", user_id="USR-ARYAN", designation="lead"))
        session.add(TeamMember(id="TM-BETA-MEM1", team_id="TEAM-BETA", user_id="USR-ANANYA", designation="member"))
        
        session.commit()
        
        # 5. Projects (The Missions)
        p1 = Project(
            id="PRJ-PHISH",
            name="PhishGuard AI",
            short_description="Next-gen phishing detection using neural networks and behavioral analysis.",
            full_description="An AI-powered cybersecurity application designed to scan network headers, links, and text patterns to block zero-day phishing attacks.",
            type="Other",
            status="LIVE",
            deadline="2026-12-31",
            academic_year="2025-26",
            team_id="TEAM-ALPHA",
            github_repo="https://github.com/sdc/phishguard",
            live_url="http://localhost:5173",
            progress=40,
            created_by="ROOT-ADMIN"
        )
        
        p2 = Project(
            id="PRJ-PORTAL",
            name="SDC Portal V1",
            short_description="Pure functional project and team management system.",
            full_description="Integrated dashboard and repository for Software Development Cell operations, including telemetry metrics, document library, and recruitment pipeline.",
            type="Web_App",
            status="LIVE",
            deadline="2026-12-31",
            academic_year="2025-26",
            team_id="TEAM-BETA",
            github_repo="https://github.com/sdc/portal",
            live_url="http://localhost:5173",
            progress=60,
            created_by="ROOT-ADMIN"
        )
        
        session.add_all([p1, p2])
        session.commit()
        
        # 6. SDLC Phases for both projects
        phases_names = ["Planning", "Analysis", "Design", "Development", "Testing", "Deployment", "Maintenance"]
        
        for project_id, p_progress in [("PRJ-PHISH", 40), ("PRJ-PORTAL", 60)]:
            phase_records = []
            for idx, phase_name in enumerate(phases_names):
                is_completed = (idx + 1) * 15 <= p_progress
                is_unlocked = idx == 0 or (idx > 0 and (idx) * 15 <= p_progress)
                p_phase = ProjectPhase(
                    id=f"PHASE-{project_id}-{phase_name.upper()}",
                    project_id=project_id,
                    name=phase_name,
                    sequence=idx + 1,
                    is_unlocked=is_unlocked,
                    is_completed=is_completed,
                    progress=100 if is_completed else (0 if not is_unlocked else (p_progress % 15) * 6)
                )
                session.add(p_phase)
                phase_records.append(p_phase)
            session.commit()
            
            # 7. Document Slots (16 mandated types)
            documents = [
                "SRS","SDD","Project_Proposal","Feasibility_Report",
                "Test_Plan","Test_Report","Deployment_Plan","User_Manual",
                "Technical_Specification","Architecture_Diagram",
                "Meeting_Minutes","Progress_Report","Risk_Register",
                "Change_Request","Code_Review_Report","Final_Report"
            ]
            for doc_type in documents:
                doc = ProjectDocument(
                    id=f"DOC-{project_id}-{doc_type}",
                    project_id=project_id,
                    document_type=doc_type,
                    file_id=None
                )
                session.add(doc)
            session.commit()
            
            # 8. Tasks (assigned in current active phases)
            # Find first unlocked but uncompleted phase
            active_phase = [p for p in phase_records if p.is_unlocked and not p.is_completed]
            if active_phase:
                ap = active_phase[0]
                assignee = "USR-SATYAM" if project_id == "PRJ-PHISH" else "USR-ARYAN"
                creator = "USR-SATYAM" if project_id == "PRJ-PHISH" else "USR-ARYAN"
                
                t_sample = Task(
                    id=f"TASK-{project_id}-001",
                    project_id=project_id,
                    phase_id=ap.id,
                    assigned_to=assignee,
                    created_by=creator,
                    title="Initialize Module Architecture",
                    description="Set up basic repository structure, folder scaffolding, and base configurations.",
                    status="IN_PROGRESS",
                    due_date=(datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")
                )
                session.add(t_sample)
            session.commit()
            
        print("Uplink Successful. SDC Database Seeded with Real Cell Operatives.")

if __name__ == "__main__":
    seed_premium_data()
