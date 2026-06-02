from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import Any

from ...api import deps
from ...models.models import User, Team, Project, Task, Member, MentorTeamLink, Submission

router = APIRouter()

@router.get("/")
def get_dashboard_data(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get customized stats and aggregates based on the user's role (Admin, Mentor, Developer)
    """
    role = current_user.role.lower()
    
    if role == "admin":
        # Calculate Admin aggregates
        total_devs = db.exec(select(func.count(User.id)).where(User.role == "developer")).first() or 0
        total_mentors = db.exec(select(func.count(User.id)).where(User.role == "mentor")).first() or 0
        total_teams = db.exec(select(func.count(Team.id))).first() or 0
        total_projects = db.exec(select(func.count(Project.id))).first() or 0
        
        # Project status counts
        live_projects = db.exec(select(func.count(Project.id)).where(Project.status == "LIVE")).first() or 0
        completed_projects = db.exec(select(func.count(Project.id)).where(Project.status == "COMPLETED")).first() or 0
        draft_projects = db.exec(select(func.count(Project.id)).where(Project.status == "DRAFT")).first() or 0
        
        return {
            "role": "admin",
            "summary": {
                "developers": total_devs,
                "mentors": total_mentors,
                "teams": total_teams,
                "projects": total_projects
            },
            "projects_status": {
                "live": live_projects,
                "completed": completed_projects,
                "draft": draft_projects
            }
        }
        
    elif role == "mentor":
        # Get Teams mapped to this Mentor
        team_statement = select(Team).join(MentorTeamLink).where(MentorTeamLink.mentor_id == current_user.id)
        mentor_teams = db.exec(team_statement).all()
        team_ids = [t.id for t in mentor_teams]
        
        # Pending task submissions for tasks in these teams' projects
        pending_reviews_count = 0
        if team_ids:
            proj_statement = select(Project.id).where(Project.teamId.in_(team_ids))
            project_ids = db.exec(proj_statement).all()
            if project_ids:
                pending_statement = select(func.count(Task.id)).where(Task.project_id.in_(project_ids), Task.status == "AWAITING_SEAL")
                pending_reviews_count = db.exec(pending_statement).first() or 0
                
        return {
            "role": "mentor",
            "summary": {
                "assigned_teams_count": len(team_ids),
                "pending_reviews": pending_reviews_count
            },
            "teams": [{"id": t.id, "name": t.name} for t in mentor_teams]
        }
        
    elif role == "developer":
        # Get Developer team mapping
        member = db.get(Member, current_user.id)
        teams_data = []
        project_data = []
        
        if member:
            teams_data = [{"id": t.id, "name": t.name} for t in member.teams]
            team_ids = [t.id for t in member.teams]
            if team_ids:
                projects = db.exec(select(Project).where(Project.teamId.in_(team_ids))).all()
                project_data = [{
                    "id": p.id,
                    "name": p.name,
                    "progress": p.progress,
                    "status": p.status
                } for p in projects]
                
        # Task breakdown
        tasks = db.exec(select(Task).where(Task.assignedTo == current_user.id)).all()
        todo = sum(1 for t in tasks if t.status == "TODO")
        in_progress = sum(1 for t in tasks if t.status == "IN_PROGRESS")
        awaiting_seal = sum(1 for t in tasks if t.status == "AWAITING_SEAL")
        done = sum(1 for t in tasks if t.status == "DONE")
        
        return {
            "role": "developer",
            "developer_profile": {
                "name": current_user.name,
                "email": current_user.email,
                "image": current_user.image
            },
            "teams": teams_data,
            "projects": project_data,
            "tasks_summary": {
                "total": len(tasks),
                "todo": todo,
                "in_progress": in_progress,
                "awaiting_review": awaiting_seal,
                "done": done
            }
        }
        
    else:
        raise HTTPException(status_code=400, detail="Invalid role context")
