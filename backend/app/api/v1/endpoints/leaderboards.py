from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import Any, List
from ....api import deps
from ....models.models import User, Team, TeamMember, Project

router = APIRouter()

@router.get("/developers")
def get_developer_leaderboard(
    db: Session = Depends(deps.get_db),
) -> Any:
    # Get active developers ordered by performance score descending
    statement = select(User).where(User.role == "developer").where(User.membership_status == "active").order_by(User.performance_score.desc())
    developers = db.exec(statement).all()
    
    leaderboard = []
    for idx, dev in enumerate(developers):
        team_name = "No Team"
        tm = db.exec(select(TeamMember).where(TeamMember.user_id == dev.id)).first()
        if tm:
            team = db.get(Team, tm.team_id)
            if team:
                team_name = team.name
                
        leaderboard.append({
            "rank": idx + 1,
            "id": dev.id,
            "name": dev.name,
            "team_name": team_name,
            "performance_score": dev.performance_score
        })
    return leaderboard

@router.get("/teams")
def get_team_leaderboard(
    db: Session = Depends(deps.get_db),
) -> Any:
    # Get teams ordered by performance score descending
    statement = select(Team).order_by(Team.performance_score.desc())
    teams = db.exec(statement).all()
    
    leaderboard = []
    for idx, team in enumerate(teams):
        leader_name = "N/A"
        tl_member = db.exec(select(TeamMember).where(TeamMember.team_id == team.id).where(TeamMember.designation == "lead")).first()
        if tl_member:
            tl_user = db.get(User, tl_member.user_id)
            if tl_user:
                leader_name = tl_user.name
                
        mentor_name = "N/A"
        mentor_member = db.exec(select(TeamMember).where(TeamMember.team_id == team.id).where(TeamMember.designation == "mentor")).first()
        if mentor_member:
            mentor_user = db.get(User, mentor_member.user_id)
            if mentor_user:
                mentor_name = mentor_user.name
                
        project_name = "No Project"
        project = db.exec(select(Project).where(Project.team_id == team.id)).first()
        if project:
            project_name = project.name
            
        leaderboard.append({
            "rank": idx + 1,
            "id": team.id,
            "name": team.name,
            "leader_name": leader_name,
            "mentor_name": mentor_name,
            "project_name": project_name,
            "performance_score": team.performance_score
        })
    return leaderboard
