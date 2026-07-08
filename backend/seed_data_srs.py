import os
from datetime import datetime, timedelta
from sqlmodel import Session, select, SQLModel
from app.db.session import engine, init_db
from app.models.models import User, Team, TeamMember, Project, ProjectPhase, ProjectDocument, Task, SystemSetting
from app.core.security import get_password_hash

def seed_srs_data():
    print("[*] Reinitializing DB schema...")
    SQLModel.metadata.create_all(engine)
    init_db() # Seeds admin@sdc.com and is_recruitment_live setting
    
    with Session(engine) as session:
        # Create Mentor
        mentor = session.exec(select(User).where(User.email == "mentor@sdc.com")).first()
        if not mentor:
            mentor = User(
                id="USR-MENTOR",
                name="Prof. Ashutosh",
                email="mentor@sdc.com",
                password_hash=get_password_hash("password123"),
                role="mentor",
                branch="Computer Science",
                admission_year=0,
                passout_year=0,
                is_active=True,
                is_retired=False,
                performance_score=0.0
            )
            session.add(mentor)
            
        # Create Team Leader (Final Year developer)
        leader = session.exec(select(User).where(User.email == "leader@sdc.com")).first()
        if not leader:
            leader = User(
                id="USR-LEADER",
                name="Siddharth Sharma",
                email="leader@sdc.com",
                password_hash=get_password_hash("password123"),
                role="developer",
                branch="Information Technology",
                admission_year=2023,
                passout_year=2027, # final year
                is_active=True,
                is_retired=False,
                performance_score=0.0
            )
            session.add(leader)
            
        # Create Developer
        dev = session.exec(select(User).where(User.email == "dev@sdc.com")).first()
        if not dev:
            dev = User(
                id="USR-DEVELOPER",
                name="Aditya Verma",
                email="dev@sdc.com",
                password_hash=get_password_hash("password123"),
                role="developer",
                branch="Computer Science",
                admission_year=2024,
                passout_year=2028,
                is_active=True,
                is_retired=False,
                performance_score=0.0
            )
            session.add(dev)
            
        session.commit()
        
        # Refresh references
        mentor = session.exec(select(User).where(User.email == "mentor@sdc.com")).one()
        leader = session.exec(select(User).where(User.email == "leader@sdc.com")).one()
        dev = session.exec(select(User).where(User.email == "dev@sdc.com")).one()
        
        # Create Team
        team = session.exec(select(Team).where(Team.name == "Phoenix Squad")).first()
        if not team:
            team = Team(
                id="TEAM-PHOENIX",
                name="Phoenix Squad",
                description="Core software engineering team for SDC Portal development",
                created_by="ROOT-ADMIN",
                performance_score=0.0
            )
            session.add(team)
            session.commit()
            session.refresh(team)
            
            # Add Team Members
            # 1. Mentor
            tm_mentor = TeamMember(
                id="TM-MENTOR",
                team_id=team.id,
                user_id=mentor.id,
                designation="mentor"
            )
            session.add(tm_mentor)
            
            # 2. Leader
            tm_leader = TeamMember(
                id="TM-LEADER",
                team_id=team.id,
                user_id=leader.id,
                designation="lead"
            )
            session.add(tm_leader)
            
            # 3. Developer
            tm_dev = TeamMember(
                id="TM-DEV",
                team_id=team.id,
                user_id=dev.id,
                designation="member"
            )
            session.add(tm_dev)
            session.commit()

        # Create Project
        project = session.exec(select(Project).where(Project.name == "SDC Portal")).first()
        if not project:
            project = Project(
                id="PROJ-SDC",
                name="SDC Portal",
                short_description="Centralized web-based project and portal management system",
                full_description="An integrated workspace for Software Development Cell operations, including user onboarding, recruitment pipeline, SDLC phase tracking, task submissions, and project documentation repository.",
                status="LIVE",
                created_by="ROOT-ADMIN",
                type="Web_App",
                deadline="2026-12-31",
                academic_year="2025-26",
                team_id=team.id,
                github_repo="https://github.com/sdc-aktu/sdc-portal",
                live_url="http://localhost:5173",
                progress=0
            )
            session.add(project)
            session.commit()
            session.refresh(project)
            
            # Create the 7 Predefined SDLC Phases
            phases = ["Planning", "Analysis", "Design", "Development", "Testing", "Deployment", "Maintenance"]
            phase_records = []
            for idx, phase_name in enumerate(phases):
                p_phase = ProjectPhase(
                    id=f"PHASE-{project.id}-{phase_name.upper()}",
                    project_id=project.id,
                    name=phase_name,
                    sequence=idx + 1,
                    is_unlocked=(idx == 0), # unlock Planning first
                    is_completed=False,
                    progress=0
                )
                session.add(p_phase)
                phase_records.append(p_phase)
            session.commit()
            
            # Create the 16 Predefined SE Documents
            documents = [
                "Product Requirements Document (PRD)", "Business Requirements Document (BRD)",
                "Software Requirements Specification (SRS)", "Use Case Document",
                "Use Case Diagrams", "Workflow Document",
                "Data Flow Diagram (DFD)", "Entity Relationship Diagram (ERD)",
                "Database Design", "API Documentation",
                "Frontend Documentation", "Backend Documentation",
                "Deployment Guide", "Testing Documentation",
                "User Manual", "Developer Guide"
            ]
            for doc_type in documents:
                doc = ProjectDocument(
                    id=f"DOC-{project.id}-{doc_type.replace(' ', '_').replace('(', '').replace(')', '')}",
                    project_id=project.id,
                    document_type=doc_type,
                    file_id=None
                )
                session.add(doc)
            session.commit()

            # Create sample tasks in Planning phase
            planning_phase = [p for p in phase_records if p.name == "Planning"][0]
            task1 = Task(
                id="TASK-001",
                project_id=project.id,
                assigned_to=leader.id,
                created_by=leader.id,
                title="Define Requirements Document",
                description="Draft initial Product Requirements and SRS document.",
                status="PENDING_VERIFICATION", # submitted
                phase_id=planning_phase.id,
                phase_name=planning_phase.name,
                due_date=(datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
                submitted_at=datetime.utcnow()
            )
            session.add(task1)
            
            task2 = Task(
                id="TASK-002",
                project_id=project.id,
                assigned_to=dev.id,
                created_by=leader.id,
                title="Conduct Stakeholder Meetings",
                description="Coordinate with Head of SDC and developers to align scope.",
                status="IN_PROGRESS",
                phase_id=planning_phase.id,
                phase_name=planning_phase.name,
                due_date=(datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d")
            )
            session.add(task2)
            session.commit()

    print("[SUCCESS] SRS compliant database seeded successfully.")

if __name__ == "__main__":
    seed_srs_data()
