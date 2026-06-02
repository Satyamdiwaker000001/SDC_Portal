from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response
from .api.v1.endpoints import auth, users, teams, projects, applications, announcements, leaderboard, settings as sys_settings
from .db.session import init_db

# --- MODULAR MONOLITH ROUTER IMPORTS ---
from .src.auth import router as src_auth
from .src.users import router as src_users
from .src.teams import router as src_teams
from .src.mentors import router as src_mentors
from .src.projects import router as src_projects
from .src.tasks import router as src_tasks
from .src.notices import router as src_notices
from .src.analytics import router as src_analytics
from .src.dashboard import router as src_dashboard
from .src.notifications import router as src_notifications
from .src.profile import router as src_profile
from .src.files import router as src_files
from .src.recruitment import router as src_recruitment
from .src.interviews import router as src_interviews
from .src.public import router as src_public
from .src.progress import router as src_progress
from .core.config import settings
from .services.sync_clock import start_sync_clock
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title=settings.PROJECT_NAME, 
    version=settings.VERSION,
    openapi_url="/sdc_portal/openapi.json",
    docs_url="/sdc_portal/docs"
)

# --- STATIC_SERVE [MEDIA_RELAY] ---
static_path = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_path):
    os.makedirs(static_path)
    os.makedirs(os.path.join(static_path, "uploads"))

app.mount("/static", StaticFiles(directory=static_path), name="static")

# --- CORS [UPLINK_SECURITY] ---

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

@app.get("/")
def root():
    return RedirectResponse(url="/sdc_portal/docs")

@app.get(f"{settings.API_V1_STR}/")
def api_base():
    return {"message": f"{settings.PROJECT_NAME} API V1 is online", "status": "READY"}

@app.on_event("startup")
def on_startup():
    init_db()
    start_sync_clock()

@app.get("/health")
def health_check():
    return {"status": "OPERATIONAL", "node": "SDC_CORE_V4"}

# --- ROUTER_REGISTRATION ---
# Modular Monolith Service Routers
app.include_router(src_auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(src_users.router, prefix=f"{settings.API_V1_STR}/admin/users", tags=["users"])
app.include_router(src_teams.router, prefix=f"{settings.API_V1_STR}", tags=["teams"])
app.include_router(src_mentors.router, prefix=f"{settings.API_V1_STR}", tags=["mentors"])
app.include_router(src_projects.router, prefix=f"{settings.API_V1_STR}", tags=["projects"])
app.include_router(src_tasks.router, prefix=f"{settings.API_V1_STR}", tags=["tasks"])
app.include_router(src_notices.router, prefix=f"{settings.API_V1_STR}", tags=["notices"])
app.include_router(src_analytics.router, prefix=f"{settings.API_V1_STR}", tags=["analytics"])
app.include_router(src_dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
app.include_router(src_notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["notifications"])
app.include_router(src_profile.router, prefix=f"{settings.API_V1_STR}/profile", tags=["profile"])
app.include_router(src_files.router, prefix=f"{settings.API_V1_STR}/files", tags=["files"])
app.include_router(src_recruitment.router, prefix=f"{settings.API_V1_STR}", tags=["recruitment"])
app.include_router(src_interviews.router, prefix=f"{settings.API_V1_STR}/interviews", tags=["interviews"])
app.include_router(src_public.router, prefix=f"{settings.API_V1_STR}/public", tags=["public"])
app.include_router(src_progress.router, prefix=f"{settings.API_V1_STR}", tags=["progress"])

# Fallback & Core Support Routers
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(applications.router, prefix=f"{settings.API_V1_STR}/applications", tags=["applications"])
app.include_router(announcements.router, prefix=f"{settings.API_V1_STR}/announcements", tags=["announcements"])
app.include_router(sys_settings.router, prefix=f"{settings.API_V1_STR}/settings", tags=["settings"])
