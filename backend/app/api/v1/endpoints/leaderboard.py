from typing import Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from ....api import deps
from ....models.models import Member, Team, Project, Task, User, TeamMemberLink

router = APIRouter()

@router.get("/")
def get_leaderboard(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Calculate and return Team and Individual leaderboards.
    """
    # 1. Team Leaderboard
    from sqlalchemy.orm import selectinload
    teams = db.exec(select(Team).options(selectinload(Team.projects))).all()
    team_stats = []
    
    for team in teams:
        projects = team.projects
        avg_progress = sum(p.progress for p in projects) / len(projects) if projects else 0
        team_stats.append({
            "id": team.id,
            "name": team.name,
            "score": round(avg_progress, 2),
            "projectCount": len(projects)
        })
    team_stats.sort(key=lambda x: x["score"], reverse=True)

    # 2. Bulk Fetch Members with Teams
    # Use selectinload for Teams to avoid lazy-loading crashes
    all_members = db.exec(select(Member).options(selectinload(Member.teams))).all()
    all_projects = db.exec(select(Project).options(selectinload(Project.team), selectinload(Project.tasks))).all()
    all_tasks = db.exec(select(Task)).all()

    # Pre-map members
    member_map = {m.id: m for m in all_members}
    
    # Pre-group tasks by member and project
    tasks_by_member = {}
    tasks_by_project = {}
    for task in all_tasks:
        if task.assignedTo:
            tasks_by_member.setdefault(task.assignedTo, []).append(task)
        if task.project_id:
            tasks_by_project.setdefault(task.project_id, []).append(task)

    # Individual Leaderboard
    member_stats = []
    for member in all_members:
        m_tasks = tasks_by_member.get(member.id, [])
        completed_tasks = len([t for t in m_tasks if t.status == "DONE"])
        avg_task_progress = sum(t.progress for t in m_tasks) / len(m_tasks) if m_tasks else 0
        
        member_stats.append({
            "id": member.id,
            "name": member.name,
            "score": round(avg_task_progress, 2),
            "avgProgress": round(avg_task_progress, 2),
            "completedTasks": completed_tasks,
            "image": member.image,
            "teams": [t.name for t in member.teams],
            "spec": member.spec or "FIELD_OPERATIVE"
        })
    member_stats.sort(key=lambda x: x["avgProgress"], reverse=True)

    # 3. Project Leaderboard
    from datetime import datetime
    project_leaderboard = []
    for project in all_projects:
        p_tasks = tasks_by_project.get(project.id, [])
        total_tasks = len(p_tasks)
        done_tasks = len([t for t in p_tasks if t.status == "DONE"])
        
        days_left = 30
        try:
            if project.deadline:
                deadline_dt = datetime.strptime(project.deadline, "%Y-%m-%d")
                days_left = (deadline_dt.date() - datetime.now().date()).days
            elif hasattr(project, 'deadline_dt') and project.deadline_dt:
                 days_left = (project.deadline_dt.date() - datetime.now().date()).days
        except: pass
            
        # Per-project member rankings
        p_member_stats = {}
        for t in p_tasks:
            if t.assignedTo:
                p_member_stats.setdefault(t.assignedTo, []).append(t.progress)
        
        p_rankings = []
        for m_id, progs in p_member_stats.items():
            if m_id in member_map:
                p_rankings.append({
                    "id": m_id,
                    "name": member_map[m_id].name,
                    "progress": round(sum(progs) / len(progs), 2),
                    "image": member_map[m_id].image
                })
        p_rankings.sort(key=lambda x: x["progress"], reverse=True)
        
        project_leaderboard.append({
            "id": project.id,
            "name": project.name,
            "teamName": project.team.name if project.team else "N/A",
            "progress": project.progress,
            "totalModules": total_tasks,
            "modulesDone": done_tasks,
            "daysLeft": max(0, days_left),
            "rankings": p_rankings,
            "status": "AT_RISK" if project.progress < 50 and days_left < 15 else "ON_TARGET"
        })
    project_leaderboard.sort(key=lambda x: x["progress"], reverse=True)

    return {
        "teams": team_stats,
        "individuals": member_stats,
        "projects": project_leaderboard
    }
