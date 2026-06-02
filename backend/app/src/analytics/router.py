from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func, or_
from typing import Any, List, Optional
from datetime import datetime

from ...api import deps
from ...models.models import Task, Team, Project, User, Member, Activity

router = APIRouter()

# --- LEADERBOARD ENDPOINTS ---

@router.get("/leaderboards/developers")
def developer_rankings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get top developers based on completed tasks count
    """
    # Group tasks by assigned developer and count completed tasks
    statement = (
        select(Task.assignedTo, func.count(Task.id).label("completed_tasks"))
        .where(Task.status == "DONE")
        .group_by(Task.assignedTo)
        .order_by(func.count(Task.id).desc())
    )
    results = db.exec(statement).all()
    
    rankings = []
    for idx, (dev_id, count) in enumerate(results):
        if not dev_id:
            continue
        member = db.get(Member, dev_id)
        if member:
            rankings.append({
                "rank": idx + 1,
                "developer_id": dev_id,
                "name": member.name,
                "spec": member.spec,
                "completed_tasks": count,
                "score": count * 10 # 10 points per completed task
            })
            
    return rankings

@router.get("/leaderboards/teams")
def team_rankings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get top teams based on project completions & overall progress
    """
    teams = db.exec(select(Team)).all()
    rankings = []
    
    for team in teams:
        projects = team.projects
        if not projects:
            avg_progress = 0
            completed_count = 0
        else:
            avg_progress = sum(p.progress for p in projects) / len(projects)
            completed_count = sum(1 for p in projects if p.status == "COMPLETED")
            
        rankings.append({
            "team_id": team.id,
            "name": team.name,
            "completed_projects": completed_count,
            "average_progress": round(avg_progress, 1),
            "score": (completed_count * 100) + int(avg_progress)
        })
        
    rankings.sort(key=lambda x: x["score"], reverse=True)
    for idx, r in enumerate(rankings):
        r["rank"] = idx + 1
        
    return rankings

@router.get("/leaderboards/projects")
def project_rankings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get project rankings based on progress percentage
    """
    statement = select(Project).order_by(Project.progress.desc())
    projects = db.exec(statement).all()
    
    rankings = []
    for idx, proj in enumerate(projects):
        rankings.append({
            "rank": idx + 1,
            "project_id": proj.id,
            "name": proj.name,
            "type": proj.type,
            "progress": proj.progress,
            "status": proj.status
        })
    return rankings

# --- ANALYTICS ENDPOINTS ---

@router.get("/analytics/teams/{teamId}")
def team_analytics(
    teamId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get performance metrics for a specific team
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    # Get all tasks for team projects
    project_ids = [p.id for p in team.projects]
    tasks = []
    if project_ids:
        tasks = db.exec(select(Task).where(Task.project_id.in_(project_ids))).all()
        
    total_tasks = len(tasks)
    todo = sum(1 for t in tasks if t.status == "TODO")
    in_progress = sum(1 for t in tasks if t.status == "IN_PROGRESS")
    awaiting_review = sum(1 for t in tasks if t.status == "AWAITING_SEAL")
    done = sum(1 for t in tasks if t.status == "DONE")
    
    return {
        "team_name": team.name,
        "total_members": len(team.members),
        "total_projects": len(team.projects),
        "task_breakdown": {
            "total": total_tasks,
            "todo": todo,
            "in_progress": in_progress,
            "awaiting_review": awaiting_review,
            "done": done
        },
        "completion_rate": round((done / total_tasks * 100), 1) if total_tasks > 0 else 0.0
    }

@router.get("/analytics/projects/{projectId}")
def project_analytics(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get performance metrics for a specific project
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    tasks = project.tasks
    total_tasks = len(tasks)
    done_tasks = sum(1 for t in tasks if t.status == "DONE")
    
    return {
        "project_name": project.name,
        "status": project.status,
        "progress": project.progress,
        "total_tasks": total_tasks,
        "completed_tasks": done_tasks,
        "completion_percentage": round((done_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0
    }

@router.get("/analytics/users/{userId}")
def user_analytics(
    userId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get performance logs for a specific developer
    """
    member = db.get(Member, userId)
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found")
        
    tasks = db.exec(select(Task).where(Task.assignedTo == userId)).all()
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "DONE")
    
    return {
        "developer_name": member.name,
        "role": member.spec,
        "total_tasks_assigned": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": total_tasks - completed_tasks,
        "efficiency_score": completed_tasks * 10
    }

# --- ACTIVITY FEED ---

@router.get("/activities")
def activity_feed(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get global activity feed logs (Admins only)
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
        
    statement = select(Activity).order_by(Activity.timestamp.desc()).limit(100)
    return db.exec(statement).all()

@router.get("/teams/{teamId}/activities")
def team_activities(
    teamId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get activity logs for a specific team
    """
    statement = select(Activity).where(Activity.team_id == teamId).order_by(Activity.timestamp.desc()).limit(50)
    return db.exec(statement).all()

@router.get("/my/progress")
def get_my_progress(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current logged-in developer's tasks progress metrics
    """
    tasks = db.exec(select(Task).where(Task.assignedTo == current_user.id)).all()
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == "DONE")
    return {
        "user_id": current_user.id,
        "total_tasks": total,
        "completed_tasks": completed,
        "progress_percentage": round((completed / total * 100), 1) if total > 0 else 0
    }

@router.get("/my/statistics")
def get_my_statistics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get personal work metrics
    """
    tasks = db.exec(select(Task).where(Task.assignedTo == current_user.id)).all()
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == "DONE")
    in_progress = sum(1 for t in tasks if t.status == "IN_PROGRESS")
    
    return {
        "total_assigned": total,
        "completed": completed,
        "in_progress": in_progress,
        "pending": total - completed
    }

@router.get("/my/modules")
def get_my_modules(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get modules assigned to the user
    """
    from ...models.models import Module
    modules = db.exec(select(Module).where(Module.owner_id == current_user.id)).all()
    return modules

@router.get("/search")
def search_catalog(
    q: str = Query(..., min_length=2),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Search catalog items
    """
    projects = db.exec(
        select(Project)
        .where(or_(Project.name.contains(q), Project.short_description.contains(q)))
    ).all()
    
    users = db.exec(
        select(User)
        .where(or_(User.name.contains(q), User.email.contains(q)))
    ).all()
    
    return {"projects": projects, "users": users}

@router.get("/audit/projects/{projectId}")
def audit_project(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get audit trail logs for a project
    """
    from ...models.models import AuditLog
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    logs = db.exec(
        select(AuditLog)
        .where(AuditLog.entity_type == "PROJECT", AuditLog.entity_id == projectId)
    ).all()
    return logs

@router.get("/audit/users/{userId}")
def audit_user(
    userId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get audit trail logs for a user
    """
    from ...models.models import AuditLog
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    logs = db.exec(
        select(AuditLog)
        .where(AuditLog.entity_type == "USER", AuditLog.entity_id == userId)
    ).all()
    return logs

@router.get("/audit/teams/{teamId}")
def audit_team(
    teamId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get audit trail logs for a team
    """
    from ...models.models import AuditLog
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    logs = db.exec(
        select(AuditLog)
        .where(AuditLog.entity_type == "TEAM", AuditLog.entity_id == teamId)
    ).all()
    return logs
