from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
from datetime import datetime
import uuid

from ...api import deps
from ...models.models import Interview, InterviewFeedback, User, Application

router = APIRouter()

class InterviewSchedule(BaseModel):
    application_id: str
    interviewer_id: str
    scheduled_at: datetime

class InterviewUpdate(BaseModel):
    interviewer_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None

class FeedbackCreate(BaseModel):
    decision: str # 'HIRED', 'REJECTED', 'NEXT_ROUND'
    feedback: str

@router.post("", status_code=status.HTTP_201_CREATED, response_model=Interview)
def schedule_interview(
    interview_in: InterviewSchedule,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    # Check if application exists
    app = db.get(Application, interview_in.application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    interview = Interview(
        id=str(uuid.uuid4()),
        application_id=interview_in.application_id,
        interviewer_id=interview_in.interviewer_id,
        scheduled_at=interview_in.scheduled_at
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview

@router.get("", response_model=List[Interview])
def list_interviews(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return db.exec(select(Interview)).all()

@router.get("/{id}", response_model=Interview)
def get_interview(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    interview = db.get(Interview, id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

@router.patch("/{id}", response_model=Interview)
def update_interview(
    id: str,
    update: InterviewUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    interview = db.get(Interview, id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    data = update.dict(exclude_unset=True)
    for key, val in data.items():
        setattr(interview, key, val)
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview

@router.delete("/{id}")
def cancel_interview(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    interview = db.get(Interview, id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    db.delete(interview)
    db.commit()
    return {"status": "SUCCESS", "message": "Interview cancelled successfully"}

@router.post("/{id}/feedback", status_code=status.HTTP_201_CREATED, response_model=InterviewFeedback)
def record_feedback(
    id: str,
    feedback_in: FeedbackCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    interview = db.get(Interview, id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    feedback = InterviewFeedback(
        id=str(uuid.uuid4()),
        interview_id=id,
        decision=feedback_in.decision.upper(),
        feedback=feedback_in.feedback
    )
    db.add(feedback)
    
    # Optionally update application status as well
    app = db.get(Application, interview.application_id)
    if app:
        if feedback_in.decision.upper() == "HIRED":
            app.status = "ACCEPTED"
        elif feedback_in.decision.upper() == "REJECTED":
            app.status = "REJECTED"
        db.add(app)
        
    db.commit()
    db.refresh(feedback)
    return feedback
