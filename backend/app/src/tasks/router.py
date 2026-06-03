from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
from datetime import datetime

from ...api import deps
from ...models.models import Task, User, Project, Team, TeamMemberLink, Submission, Review

router = APIRouter()

class TaskCreate(BaseModel):
    id: str
    moduleName: str
    title: str
    project_id: str
    assignedTo: Optional[str] = None
    status: Optional[str] = "TODO"

class AssignTaskRequest(BaseModel):
    assignedTo: str

class TaskStatusUpdate(BaseModel):
    status: str
    progress: Optional[int] = None
    whatsDone: Optional[List[str]] = None
    whatsGoingOn: Optional[str] = None
    workLog: Optional[str] = None

class SubmissionCreate(BaseModel):
    content: str # Link to GitHub branch, Google Drive, or descriptive text

class ReviewCreate(BaseModel):
    submission_id: int
    status: str # APPROVED, REJECTED
    comments: Optional[str] = None

@router.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new task under a project (Team Leader or Admin only)
    """
    existing = db.get(Task, task_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Task ID already exists")
        
    project = db.get(Project, task_in.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Associated project not found")
        
    # Permission: Admin or Team Leader
    if current_user.role != "admin":
        if not project.teamId:
            raise HTTPException(status_code=403, detail="No team assigned to this project yet")
        team = db.get(Team, project.teamId)
        if not team or team.leaderId != current_user.id:
            raise HTTPException(status_code=403, detail="Only Admins or Team Leaders can create tasks")

    task = Task(
        id=task_in.id,
        moduleName=task_in.moduleName,
        title=task_in.title,
        project_id=task_in.project_id,
        assignedTo=task_in.assignedTo,
        status=task_in.status,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"status": "SUCCESS", "task": task}

@router.patch("/tasks/{taskId}/assign")
def assign_task(
    taskId: str,
    request: AssignTaskRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Assign task to a developer (Team Leader or Admin only)
    """
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    project = db.get(Project, task.project_id)
    # Check if assignee belongs to the team
    if project.teamId:
        link = db.exec(select(TeamMemberLink).where(TeamMemberLink.team_id == project.teamId, TeamMemberLink.member_id == request.assignedTo)).first()
        if not link:
            raise HTTPException(status_code=400, detail="Assignee is not a member of the project team")
            
    # Permission check: Team Leader or Admin
    if current_user.role != "admin":
        team = db.get(Team, project.teamId) if project.teamId else None
        if not team or team.leaderId != current_user.id:
            raise HTTPException(status_code=403, detail="Only Admins or Team Leaders can assign tasks")

    task.assignedTo = request.assignedTo
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"status": "SUCCESS", "task": task}

@router.get("/tasks")
def get_all_tasks(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    List all tasks (Admin only)
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Admins can view all tasks")
    return db.exec(select(Task)).all()

@router.get("/developer/tasks")
def get_my_tasks(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    List tasks assigned to the currently logged-in user
    """
    statement = select(Task).where(Task.assignedTo == current_user.id)
    return db.exec(statement).all()

@router.get("/tasks/{taskId}")
def task_details(
    taskId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get detailed task metrics
    """
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/tasks/{taskId}/status")
def update_task_status(
    taskId: str,
    update: TaskStatusUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update task progress/status details (Assigned User or Team Leader)
    """
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    project = db.get(Project, task.project_id)
    team = db.get(Team, project.teamId) if project.teamId else None

    # Check permission: Assigned User, Team Leader, or Admin
    is_assigned = task.assignedTo == current_user.id
    is_leader = team and team.leaderId == current_user.id
    is_admin = current_user.role == "admin"
    
    if not (is_assigned or is_leader or is_admin):
        raise HTTPException(status_code=403, detail="Not authorized to update status of this task")

    data = update.dict(exclude_unset=True)
    for key, val in data.items():
        setattr(task, key, val)
        
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"status": "SUCCESS", "task": task}

@router.delete("/tasks/{taskId}")
def delete_task(
    taskId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a task (Admin / Team Leader only)
    """
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    project = db.get(Project, task.project_id)
    # Permission check: Team Leader or Admin
    if current_user.role != "admin":
        team = db.get(Team, project.teamId) if project.teamId else None
        if not team or team.leaderId != current_user.id:
            raise HTTPException(status_code=403, detail="Only Admins or Team Leaders can delete tasks")
            
    db.delete(task)
    db.commit()
    return {"status": "SUCCESS", "message": "Task deleted"}

# --- SUBMISSION SERVICE ENDPOINTS ---

@router.post("/tasks/{taskId}/submit")
def submit_work(
    taskId: str,
    submission_in: SubmissionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Submit completed task work for evaluation. Sets task status to AWAITING_SEAL.
    """
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # Permission check: Assigned User, Team Leader or Admin
    project = db.get(Project, task.project_id)
    team = db.get(Team, project.teamId) if project.teamId else None
    
    is_assigned = task.assignedTo == current_user.id
    is_leader = team and team.leaderId == current_user.id
    is_admin = current_user.role == "admin"
    
    if not (is_assigned or is_leader or is_admin):
        raise HTTPException(status_code=403, detail="Not authorized to submit work for this task")

    # Create submission
    submission = Submission(
        task_id=taskId,
        submitted_by=current_user.id,
        content=submission_in.content
    )
    db.add(submission)
    
    # Auto transition status to AWAITING_SEAL
    task.status = "AWAITING_SEAL"
    db.add(task)
    
    db.commit()
    db.refresh(submission)
    return {"status": "SUCCESS", "message": "Work submitted successfully. Task status set to AWAITING_SEAL.", "submission": submission}

@router.get("/submissions/{submissionId}")
def get_submission_details(
    submissionId: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get specific task submission details
    """
    submission = db.get(Submission, submissionId)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

# --- REVIEW SERVICE ENDPOINTS ---

@router.post("/reviews")
def review_submission(
    review_in: ReviewCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Submit a review for a task submission (Mentor / Admin only)
    """
    if current_user.role != "mentor" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Mentors and Admins can review submissions")
        
    submission = db.get(Submission, review_in.submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission target not found")
        
    task = db.get(Task, submission.task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Associated task not found")
        
    # Create review
    review = Review(
        submission_id=review_in.submission_id,
        reviewed_by=current_user.id,
        status=review_in.status.upper(),
        comments=review_in.comments
    )
    db.add(review)
    
    # Update Task Status depending on review decision
    if review_in.status.upper() == "APPROVED":
        task.status = "DONE"
        task.progress = 100
        task.reviewFeedback = "Approved by Mentor"
    else:
        task.status = "IN_PROGRESS"
        task.reviewFeedback = review_in.comments or "Rejected by Mentor"
        
    db.add(task)
    db.commit()
    db.refresh(review)
    return {"status": "SUCCESS", "message": f"Submission reviewed as {review_in.status.upper()}", "review": review}

@router.post("/reviews/{reviewId}/approve")
def approve_review_directly(
    reviewId: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Directly approve an existing review record (Mentor / Admin only)
    """
    if current_user.role != "mentor" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Mentors and Admins can approve reviews")
        
    review = db.get(Review, reviewId)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    review.status = "APPROVED"
    db.add(review)
    
    # Sync with task
    submission = db.get(Submission, review.submission_id)
    if submission:
        task = db.get(Task, submission.task_id)
        if task:
            task.status = "DONE"
            task.progress = 100
            db.add(task)
            
    db.commit()
    return {"status": "SUCCESS", "message": "Review approved"}

@router.post("/reviews/{reviewId}/reject")
def reject_review_directly(
    reviewId: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Directly reject an existing review record (Mentor / Admin only)
    """
    if current_user.role != "mentor" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Mentors and Admins can reject reviews")
        
    review = db.get(Review, reviewId)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    review.status = "REJECTED"
    db.add(review)
    
    # Sync with task
    submission = db.get(Submission, review.submission_id)
    if submission:
        task = db.get(Task, submission.task_id)
        if task:
            task.status = "IN_PROGRESS"
            db.add(task)
            
    db.commit()
    return {"status": "SUCCESS", "message": "Review rejected"}

class CommentCreate(BaseModel):
    comment: str

@router.post("/tasks/{taskId}/comments")
def create_task_comment(
    taskId: str,
    comment_in: CommentCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Comment on a task
    """
    from ...models.models import TaskComment
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    import uuid
    comment = TaskComment(
        id=str(uuid.uuid4()),
        task_id=taskId,
        user_id=current_user.id,
        comment=comment_in.comment
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return {"status": "SUCCESS", "comment": comment}

@router.get("/tasks/{taskId}/comments")
def get_task_comments(
    taskId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get comments for a task
    """
    from ...models.models import TaskComment
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    comments = db.exec(select(TaskComment).where(TaskComment.task_id == taskId)).all()
    return comments

@router.post("/tasks/{taskId}/submission")
def submit_work_alias(
    taskId: str,
    submission_in: SubmissionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Alias for task work submission
    """
    return submit_work(taskId=taskId, submission_in=submission_in, db=db, current_user=current_user)

@router.get("/submissions")
def get_all_submissions(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get all task submissions
    """
    return db.exec(select(Submission)).all()

@router.get("/submissions/{submissionId}/reviews")
def get_submission_reviews(
    submissionId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get all reviews for a submission
    """
    reviews = db.exec(select(Review).where(Review.submission_id == submissionId)).all()
    return reviews

@router.patch("/reviews/{reviewId}")
def update_review(
    reviewId: str,
    comments: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update an existing review
    """
    review = db.get(Review, reviewId)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if comments is not None:
        review.comments = comments
    if status is not None:
        review.status = status.upper()
    db.add(review)
    db.commit()
    db.refresh(review)
    return {"status": "SUCCESS", "review": review}

@router.delete("/reviews/{reviewId}")
def delete_review(
    reviewId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a review record
    """
    review = db.get(Review, reviewId)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"status": "SUCCESS", "message": "Review deleted"}
