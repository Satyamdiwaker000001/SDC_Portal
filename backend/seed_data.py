import os
from sqlmodel import Session, select
from backend.app.db.session import engine, init_db
from backend.app.models.models import Member, Team, Project, Task, Announcement, User
from datetime import datetime, timedelta


def create_sample_data():
    # Ensure tables exist
    init_db()
    with Session(engine) as session:
        # Create sample members
        members = []
        for i in range(1, 6):
            member = Member(
                id=f"MEM-{i:03d}",
                name=f"Member {i}",
                email=f"member{i}@example.com",
                spec="Frontend Developer" if i % 2 == 0 else "Backend Engineer",
                joinDate="2024-01-01",
                retirementDate=None,
                status="ACTIVE",
                image=f"/static/uploads/member{i}.png",
                techStack=["React", "Node.js"] if i % 2 == 0 else ["Vue", "Django"],
                githubUrl=None,
                linkedinUrl=None,
                isFounder=False,
            )
            members.append(member)
            session.add(member)

        # Create a team and assign members
        team = Team(
            id="TEAM-001",
            name="Alpha Squad",
            leaderId=members[0].id,
        )
        session.add(team)
        session.flush()  # get team persisted
        # Link members to team via association table
        for m in members:
            session.execute(
                "INSERT INTO teammemberlink (team_id, member_id) VALUES (:team_id, :member_id)",
                {"team_id": team.id, "member_id": m.id},
            )

        # Create a project for the team
        project = Project(
            id="PROJ-001",
            name="Operation Phoenix",
            description="High‑impact cyber‑defense mission",
            type="Cybersecurity",
            status="LIVE",
            deadline=(datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
            progress=45,
            teamId=team.id,
        )
        session.add(project)
        session.flush()

        # Create tasks for the project
        for j in range(1, 4):
            task = Task(
                id=f"TASK-{j:03d}",
                moduleName="UI_LAYER" if j % 2 else "CORE_API",
                title=f"Task {j}",
                assignedTo=members[j % len(members)].id,
                status="IN_PROGRESS" if j < 3 else "DONE",
                progress=30 * j,
                project_id=project.id,
            )
            session.add(task)

        # Create a global announcement
        announcement_global = Announcement(
            title="System Maintenance",
            body="Scheduled maintenance on 2026‑05‑01 02:00 UTC.",
            priority="Important",
            is_global=True,
            timestamp=datetime.utcnow(),
        )
        session.add(announcement_global)

        # Create a targeted announcement for the team
        announcement_target = Announcement(
            title="Alpha Squad Briefing",
            body="Team meeting at 10:00 AM tomorrow.",
            priority="Normal",
            is_global=False,
            timestamp=datetime.utcnow(),
        )
        session.add(announcement_target)
        session.flush()
        # Link announcement to team
        session.execute(
            "INSERT INTO announcementteamlink (announcement_id, team_id) VALUES (:ann_id, :team_id)",
            {"ann_id": announcement_target.id, "team_id": team.id},
        )

        session.commit()
        print("✅ Sample data seeded successfully.")


if __name__ == "__main__":
    create_sample_data()
