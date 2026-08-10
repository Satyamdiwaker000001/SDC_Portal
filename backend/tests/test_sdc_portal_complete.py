import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
import sys
import os

# Ensure app path is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from app.api import deps
from app.db.session import get_db
from app.core.security import get_password_hash
from app.models.models import User, Application, Team, Project, Task, SystemSetting

# Create isolated test database
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

def override_get_db():
    with Session(engine) as session:
        yield session

app.dependency_overrides[deps.get_db] = override_get_db

@pytest.fixture(name="client")
def client_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Seed test admin
        admin = User(
            id="USR-ADMIN-TEST",
            name="Test Admin",
            email="admin@sdc.edu",
            password_hash=get_password_hash("admin@sdc!@#"),
            role="admin",
            branch="Administration",
            admission_year=2024,
            passout_year=2028,
            membership_status="active",
            is_active=True
        )
        session.add(admin)
        session.commit()
    client = TestClient(app)
    yield client
    SQLModel.metadata.drop_all(engine)

# ==========================================
# 1. AUTHENTICATION & SECURITY TEST CASES
# ==========================================
def test_tc_sec_001_admin_login(client):
    """TC-SEC-001: Test successful admin login with valid credentials."""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@sdc.edu", "password": "admin@sdc!@#"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_tc_sec_002_invalid_credentials_login(client):
    """TC-SEC-002: Test login failure with invalid password."""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@sdc.edu", "password": "wrongpassword"}
    )
    assert response.status_code == 400

# ==========================================
# 2. SCHEMA & DOMAIN VALIDATION TEST CASES
# ==========================================
def test_tc_val_001_email_domain_validation(client):
    """TC-VAL-001: Test strict enforcement of allowed email domains (@rbmi.in, @sdc.edu)."""
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin@sdc.edu", "password": "admin@sdc!@#"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Disallowed email domain @gmail.com
    bad_payload = {
        "email": "hacker@gmail.com",
        "name": "Invalid Domain User",
        "password": "Password123!",
        "role": "developer",
        "admission_year": 2023,
        "passout_year": 2027
    }
    res = client.post("/api/v1/users/", json=bad_payload, headers=headers)
    assert res.status_code == 422  # Validation Error

    # Allowed student email domain @rbmi.in
    good_payload = {
        "email": "cs23satyam@rbmi.in",
        "name": "Satyam Diwaker",
        "password": "Password123!",
        "role": "developer",
        "branch": "CSE",
        "admission_year": 2023,
        "passout_year": 2027
    }
    res_ok = client.post("/api/v1/users/", json=good_payload, headers=headers)
    assert res_ok.status_code == 200
    assert res_ok.json()["email"] == "cs23satyam@rbmi.in"

def test_tc_val_002_positive_year_validation(client):
    """TC-VAL-002: Test negative dates/years are rejected."""
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin@sdc.edu", "password": "admin@sdc!@#"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    bad_year_payload = {
        "email": "dev1@rbmi.in",
        "name": "Bad Year User",
        "password": "Password123!",
        "role": "developer",
        "admission_year": -2023,
        "passout_year": 2027
    }
    res = client.post("/api/v1/users/", json=bad_year_payload, headers=headers)
    assert res.status_code == 422

def test_tc_val_003_passout_year_logic(client):
    """TC-VAL-003: Test passout year cannot be earlier than admission year."""
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin@sdc.edu", "password": "admin@sdc!@#"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    invalid_logic_payload = {
        "email": "dev2@rbmi.in",
        "name": "Time Traveler",
        "password": "Password123!",
        "role": "developer",
        "admission_year": 2025,
        "passout_year": 2023
    }
    res = client.post("/api/v1/users/", json=invalid_logic_payload, headers=headers)
    assert res.status_code == 422

# ==========================================
# 3. RECRUITMENT WORKFLOW TEST CASES
# ==========================================
def test_tc_rec_workflow(client):
    """TC-REC-001 & 002: Public recruitment application to approval workflow."""
    # 1. Public user submits application
    app_payload = {
        "name": "Applicant Student",
        "email": "it24applicant@rbmi.in",
        "mobile_number": "9876543210",
        "branch": "Information Technology",
        "admission_year": 2024,
        "passout_year": 2028,
        "batch_year": "2024-28",
        "current_semester": "Semester 2",
        "technical_specialization": "Web Development"
    }
    app_res = client.post("/api/v1/applications/", json=app_payload)
    assert app_res.status_code == 200
    app_data = app_res.json()
    assert app_data["status"] == "PENDING"
    app_id = app_data["id"]

    # 2. Admin logs in and approves application
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin@sdc.edu", "password": "admin@sdc!@#"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    approve_res = client.post(f"/api/v1/applications/{app_id}/approve", headers=headers)
    assert approve_res.status_code == 200
    approve_data = approve_res.json()
    assert approve_data["status"] == "APPROVED"
    assert "user_id" in approve_data

# ==========================================
# 4. ROSTER & PORTFOLIO TELEMETRY TEST CASES
# ==========================================
def test_tc_roster_and_portfolio(client):
    """TC-ROST-001 & TC-PORT-001: Test public roster and developer portfolio endpoints."""
    # Create founder and developer users
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin@sdc.edu", "password": "admin@sdc!@#"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    founder_user = client.post("/api/v1/users/", json={
        "email": "cs23founder@rbmi.in",
        "name": "Founder Leader",
        "password": "Password123!",
        "role": "founder",
        "admission_year": 2023,
        "passout_year": 2027
    }, headers=headers).json()

    # 1. Query public roster
    roster_res = client.get("/api/v1/users/public/roster")
    assert roster_res.status_code == 200
    roster = roster_res.json()
    assert len(roster) >= 1
    assert any(u["id"] == founder_user["id"] for u in roster)

    # 2. Query public developer portfolio telemetry
    port_res = client.get(f"/api/v1/users/public/portfolio/{founder_user['id']}")
    assert port_res.status_code == 200
    port_data = port_res.json()
    assert port_data["user"]["name"] == "Founder Leader"
    assert "stats" in port_data
    assert "projects" in port_data

# ==========================================
# 5. USER STATUS TOGGLE TEST CASE
# ==========================================
def test_tc_user_status_toggle(client):
    """Test admin toggle of member active status (is_active)."""
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin@sdc.edu", "password": "admin@sdc!@#"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    dev = client.post("/api/v1/users/", json={
        "email": "devactive@rbmi.in",
        "name": "Dev Status Test",
        "password": "Password123!",
        "role": "developer",
        "admission_year": 2023,
        "passout_year": 2027
    }, headers=headers).json()

    # Toggle to inactive (is_active = False)
    toggle_res = client.patch(f"/api/v1/users/{dev['id']}/status?is_active=false", headers=headers)
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_active"] is False

# ==========================================
# 6. E2E TEAM, PROJECT, TASK, LEADERBOARD & PROGRESS UNLOCK TEST CASE
# ==========================================
def test_tc_e2e_team_project_task_leaderboard_progress_unlock(client):
    """
    Test End-To-End Pipeline:
    Team Creation -> Project Assignment -> Task Creation -> Task Submission ->
    Mentor Verification -> XP Leaderboard Telemetry Update -> Auto Phase Unlock.
    """
    # 1. Admin Login
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin@sdc.edu", "password": "admin@sdc!@#"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Developer & Mentor
    dev = client.post("/api/v1/users/", json={
        "email": "cs23dev1@rbmi.in",
        "name": "Sprint Dev One",
        "password": "Password123!",
        "role": "developer",
        "branch": "CSE",
        "admission_year": 2023,
        "passout_year": 2027
    }, headers=headers).json()

    mentor = client.post("/api/v1/users/", json={
        "email": "mentor1@sdc.edu",
        "name": "Sprint Mentor One",
        "password": "Password123!",
        "role": "mentor",
        "branch": "Faculty",
        "admission_year": 2020,
        "passout_year": 2024
    }, headers=headers).json()

    # 3. Team Creation
    team_res = client.post("/api/v1/teams/", json={
        "name": "Alpha Squad",
        "description": "High performance software squad"
    }, headers=headers)
    assert team_res.status_code == 200
    team = team_res.json()
    assert team["name"] == "Alpha Squad"

    # Add Dev to Team
    client.post(f"/api/v1/teams/{team['id']}/members", json={
        "user_id": dev["id"],
        "designation": "member"
    }, headers=headers)

    # 4. Project Creation & Team Assignment
    proj_res = client.post("/api/v1/projects/", json={
        "name": "SDC Enterprise Cloud Portal",
        "short_description": "Official institution platform",
        "type": "Web_App",
        "team_id": team["id"],
        "status": "LIVE"
    }, headers=headers)
    assert proj_res.status_code == 200
    project = proj_res.json()
    assert project["team_id"] == team["id"]

    # Fetch Auto-Created SDLC Phases
    phases_res = client.get(f"/api/v1/projects/{project['id']}/phases", headers=headers)
    assert phases_res.status_code == 200
    phases = phases_res.json()
    assert len(phases) > 0
    phase1 = phases[0]

    # 5. Task Creation in Phase 1
    task_res = client.post(f"/api/v1/tasks/?project_id={project['id']}", json={
        "title": "Build Auth Handshake Module",
        "description": "Implement JWT verification and bcrypt hashing",
        "phase_id": phase1["id"],
        "assigned_to": dev["id"],
        "due_date": "2026-12-31",
        "xp_reward": 100
    }, headers=headers)
    assert task_res.status_code == 200
    task = task_res.json()
    assert task["assigned_to"] == dev["id"]

    # 6. Task Submission by Developer
    sub_res = client.post(f"/api/v1/tasks/{task['id']}/submit", json={
        "github_url": "https://github.com/sdc/auth-module",
        "live_demo_url": "https://auth.sdc.edu",
        "notes": "Code completed with 100% test coverage."
    }, headers=headers)
    assert sub_res.status_code == 200
    assert sub_res.json()["status"] == "PENDING_VERIFICATION"

    # 7. Task Progress Approval & Verification by Mentor
    verify_res = client.post(f"/api/v1/tasks/{task['id']}/verify", json={
        "decision": "VERIFY",
        "remarks": "Excellent implementation and adherence to SDLC."
    }, headers=headers)
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "COMPLETED"

    # 8. Check Live Leaderboard & Developer Performance Score Update
    leaderboard_res = client.get("/api/v1/users/telemetry/leaderboard", headers=headers)
    assert leaderboard_res.status_code == 200
    lb_data = leaderboard_res.json()
    assert len(lb_data) >= 1
    top_user = lb_data[0]
    assert top_user["id"] == dev["id"]
    assert top_user["performance_score"] > 0.0  # XP updated (+10 base + 5 bonus)

    # 9. Verify Project Progress Bar Updated Live
    updated_proj_res = client.get(f"/api/v1/projects/{project['id']}", headers=headers)
    assert updated_proj_res.status_code == 200
    assert updated_proj_res.json()["progress"] == 100

