from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "SDC_Portal_API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "706e2e03507d4b29f798e68f472f8426a")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://3gRC4rrn2ZMaUyg.root:KvgMsWSamrqY9Q1a@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/sdc_portal"
    )
    DB_CA_PATH: Optional[str] = os.getenv("DB_CA_PATH")
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174"
    )
    
    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME: Optional[str] = os.getenv("CLOUDINARY_CLOUD_NAME", "mzw4uphd")
    CLOUDINARY_API_KEY: Optional[str] = os.getenv("CLOUDINARY_API_KEY", "773597744456378")
    CLOUDINARY_API_SECRET: Optional[str] = os.getenv("CLOUDINARY_API_SECRET", "-kGSFQ6dgAPu3lN9Et72m9Pi5iU")

    class Config:
        case_sensitive = True

settings = Settings()
