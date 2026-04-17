import sys
import os
from datetime import datetime

# Add the backend directory to sys.path to allow imports from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine
from app.models.models import Member, Team, Project, Task, Setting, User
from sqlmodel import Session, select

def seed_premium_data():
    with Session(engine) as session:
        print("Seeding premium tactical data...")
        
        # 1. Members (The Operatives)
        m1 = Member(
            id="MEM-001", 
            name="Satyam Diwaker", 
            email="satyam@sdc.com", 
            spec="Fullstack Lead", 
            joinDate="2023-01-15", 
            status="ACTIVE", 
            isFounder=True,
            image="https://api.dicebear.com/7.x/avataaars/svg?seed=Satyam"
        )
        m2 = Member(
            id="MEM-002", 
            name="Aryan Raj", 
            email="aryan@sdc.com", 
            spec="Backend Dev", 
            joinDate="2023-06-10", 
            status="ACTIVE",
            image="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan"
        )
        m3 = Member(
            id="MEM-003", 
            name="Ananya Singh", 
            email="ananya@sdc.com", 
            spec="UI/UX Designer", 
            joinDate="2024-02-01", 
            status="ACTIVE",
            image="https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
        )
        m4 = Member(
            id="MEM-004", 
            name="Rohan Gupta", 
            email="rohan@sdc.com", 
            spec="Cyber Security", 
            joinDate="2024-01-20", 
            status="ACTIVE",
            image="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
        )
        
        session.add_all([m1, m2, m3, m4])
        session.commit() # Save members first so they can be linked
        
        # 2. Teams (The Squads)
        t1 = Team(id="TEAM-ALPHA", name="PhishGuard Ops", leaderId="MEM-001")
        t2 = Team(id="TEAM-BETA", name="Portal Architects", leaderId="MEM-002")
        
        # Relationships (Secondary Link Table handled by SQLModel)
        t1.members = [m1, m2, m4] # satyam, aryan, rohan
        t2.members = [m2, m3]     # aryan, ananya
        
        session.add_all([t1, t2])
        session.commit()
        
        # 3. Projects (The Missions)
        p1 = Project(
            id="PRJ-PHISH", 
            name="PhishGuard AI", 
            description="Next-gen phishing detection using neural networks and behavioral analysis.", 
            type="Cybersecurity", 
            status="LIVE", 
            deadline="2024-12-31", 
            progress=65, 
            academicYear="2024-25", 
            teamId="TEAM-ALPHA",
            gitHubRepo="https://github.com/sdc/phishguard"
        )
        p2 = Project(
            id="PRJ-PORTAL", 
            name="SDC Portal V1", 
            description="Pure functional management system with tactical dashboard interfaces.", 
            type="Web App", 
            status="LIVE", 
            deadline="2025-05-15", 
            progress=42, 
            academicYear="2024-25", 
            teamId="TEAM-BETA",
            gitHubRepo="https://github.com/sdc/portal"
        )
        
        session.add_all([p1, p2])
        session.commit()
        
        # 4. Tasks (The Modules)
        tasks = [
            # PhishGuard Modules
            Task(
                id="MOD-001", 
                moduleName="DETECTION_ENGINE", 
                title="Neural Link Implementation", 
                project_id="PRJ-PHISH", 
                status="DONE", 
                progress=100, 
                whatsDone=["Transformer architecture", "Data pipeline", "Preprocessing scripts"], 
                whatsGoingOn="Optimizing inference time",
                assignedTo="MEM-001"
            ),
            Task(
                id="MOD-002", 
                moduleName="UI_CORE", 
                title="Real-time Analytics Overlay", 
                project_id="PRJ-PHISH", 
                status="IN_PROGRESS", 
                progress=55, 
                whatsDone=["Layout grid", "D3.js integration"], 
                whatsGoingOn="Binding live websocket data",
                assignedTo="MEM-003"
            ),
            Task(
                id="MOD-003", 
                moduleName="SECURITY_AUDIT", 
                title="Endpoint Hardening", 
                project_id="PRJ-PHISH", 
                status="TODO", 
                progress=0, 
                assignedTo="MEM-004"
            ),
            
            # Portal Modules
            Task(
                id="MOD-004", 
                moduleName="BACKEND_SYNC", 
                title="Functional State Persistence", 
                project_id="PRJ-PORTAL", 
                status="IN_PROGRESS", 
                progress=30, 
                whatsDone=["Schema definitions", "SQLite migration script"], 
                whatsGoingOn="Implementing recursive sync logic",
                assignedTo="MEM-002"
            )
        ]
        
        session.add_all(tasks)
        
        # 5. Global Settings
        session.add(Setting(key="isRecruitmentOpen", value="true"))
        session.add(Setting(key="ACADEMIC_YEAR", value="2024-25"))
        
        session.commit()
        print("Uplink Successful. SDC Database Seeded with Premium Intel.")

if __name__ == "__main__":
    seed_premium_data()
