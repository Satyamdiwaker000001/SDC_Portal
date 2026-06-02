from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
import uuid

from ...api import deps
from ...models.models import ProgressReport, ProgressFeedback, User, Project, Team

router = APIRouter()

class ReportCreate(BaseModel):
    team_id: str
    current_progress: int
    blockers: Optional[str] = None
    next_goal: Optional[str] = None

class FeedbackCreate(BaseModel):
    feedback_text: str

@router.get("/projects/{projectId}/progress")
def get_project_progress(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get aggregated project progress metric
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"project_id": projectId, "progress": project.progress}

@router.get("/teams/{teamId}/progress")
def get_team_progress(
    teamId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get aggregated team projects progress
    """
    team = db.get(Team, teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    projects = team.projects if hasattr(team, "projects") else []
    avg_progress = sum(p.progress for p in projects) / len(projects) if projects else 0
    return {"team_id": teamId, "average_progress": avg_progress}

@router.get("/users/{userId}/progress")
def get_user_progress(
    userId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get developer task completions count
    """
    from ...models.models import Task
    tasks = db.exec(select(Task).where(Task.assignedTo == userId)).all()
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == "DONE")
    return {
        "user_id": userId,
        "total_tasks": total,
        "completed_tasks": completed,
        "progress_percentage": round((completed / total * 100), 1) if total > 0 else 0
    }

@router.post("/projects/{projectId}/progress-reports", status_code=status.HTTP_201_CREATED)
def submit_progress_report(
    projectId: str,
    report_in: ReportCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Submit a weekly project status report
    """
    report = ProgressReport(
        id=str(uuid.uuid4()),
        project_id=projectId,
        team_id=report_in.team_id,
        submitted_by=current_user.id,
        current_progress=report_in.current_progress,
        blockers=report_in.blockers,
        next_goal=report_in.next_goal
    )
    db.add(report)
    
    # Update project progress as well
    project = db.get(Project, projectId)
    if project:
        project.progress = report_in.current_progress
        db.add(project)
        
    db.commit()
    db.refresh(report)
    return report

@router.get("/projects/{projectId}/progress-reports", response_model=List[ProgressReport])
def list_progress_reports(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get progress reports list for a project
    """
    return db.exec(select(ProgressReport).where(ProgressReport.project_id == projectId)).all()

@router.get("/progress-reports/{reportId}", response_model=ProgressReport)
def get_progress_report(
    reportId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get detailed progress report information
    """
    report = db.get(ProgressReport, reportId)
    if not report:
        raise HTTPException(status_code=404, detail="Progress report not found")
    return report

@router.post("/progress-reports/{reportId}/feedback", status_code=status.HTTP_201_CREATED, response_model=ProgressFeedback)
def submit_report_feedback(
    reportId: str,
    feedback_in: FeedbackCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mentor/Admin leaves evaluation comments on a progress report
    """
    if current_user.role != "mentor" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Mentors and Admins can submit progress feedback")
        
    feedback = ProgressFeedback(
        id=str(uuid.uuid4()),
        report_id=reportId,
        feedback_by=current_user.id,
        feedback_text=feedback_in.feedback_text
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback
