from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response
from .api.v1.endpoints import auth, users, teams, projects, applications, announcements, notices, interactions, leaderboards, audit, settings as settings_endpoint, tasks
from .db.session import init_db
from .core.config import settings
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
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

@app.get("/health")
def health_check():
    return {"status": "OPERATIONAL", "node": "SDC_CORE_V4"}

# --- ROUTER_REGISTRATION ---
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(teams.router, prefix=f"{settings.API_V1_STR}/teams", tags=["teams"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(applications.router, prefix=f"{settings.API_V1_STR}/applications", tags=["applications"])
app.include_router(announcements.router, prefix=f"{settings.API_V1_STR}/announcements", tags=["announcements"])
app.include_router(interactions.router, prefix=f"{settings.API_V1_STR}/interactions", tags=["interactions"])
app.include_router(leaderboards.router, prefix=f"{settings.API_V1_STR}/leaderboards", tags=["leaderboards"])
app.include_router(audit.router, prefix=f"{settings.API_V1_STR}/audit", tags=["audit"])
app.include_router(settings_endpoint.router, prefix=f"{settings.API_V1_STR}/settings", tags=["settings"])
app.include_router(tasks.router, prefix=f"{settings.API_V1_STR}/tasks", tags=["tasks"])
app.include_router(notices.router, prefix=f"{settings.API_V1_STR}/notices", tags=["notices"])
