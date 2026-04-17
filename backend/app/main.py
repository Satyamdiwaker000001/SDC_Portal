from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.endpoints import auth, users, teams, projects, applications, announcements, leaderboard, settings as sys_settings
from .db.session import init_db
from .core.config import settings
from .services.sync_clock import start_sync_clock
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title=settings.PROJECT_NAME, 
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/api/docs"
)

# --- STATIC_SERVE [MEDIA_RELAY] ---
static_path = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_path):
    os.makedirs(static_path)
    os.makedirs(os.path.join(static_path, "uploads"))

app.mount("/static", StaticFiles(directory=static_path), name="static")

# --- CORS [UPLINK_SECURITY] ---
from fastapi.responses import Response

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
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health"
    }

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
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(teams.router, prefix=f"{settings.API_V1_STR}/teams", tags=["teams"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(applications.router, prefix=f"{settings.API_V1_STR}/applications", tags=["applications"])
app.include_router(announcements.router, prefix=f"{settings.API_V1_STR}/announcements", tags=["announcements"])
app.include_router(leaderboard.router, prefix=f"{settings.API_V1_STR}/leaderboard", tags=["leaderboard"])
app.include_router(sys_settings.router, prefix=f"{settings.API_V1_STR}/settings", tags=["settings"])
