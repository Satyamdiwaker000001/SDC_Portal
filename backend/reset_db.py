import urllib.parse
import pymysql
from app.core.config import settings

def reset():
    # Parse host, user, password, port from settings.DATABASE_URL
    url = urllib.parse.urlparse(settings.DATABASE_URL)
    dbname = url.path.lstrip('/')
    
    ssl_config = None
    if "mysql" in settings.DATABASE_URL:
        ca_path = settings.DB_CA_PATH
        if not ca_path:
            try:
                import certifi
                ca_path = certifi.where()
            except ImportError:
                ca_path = None
        if ca_path:
            ssl_config = {"ca": ca_path}

    connection = pymysql.connect(
        host=url.hostname or "localhost",
        port=url.port or 3306,
        user=url.username or "root",
        password=url.password or "",
        ssl=ssl_config
    )
    
    with connection.cursor() as cursor:
        cursor.execute(f"DROP DATABASE IF EXISTS {dbname}")
        cursor.execute(f"CREATE DATABASE {dbname}")
    
    connection.commit()
    connection.close()
    print(f"Database '{dbname}' dropped and cleanly recreated.")

if __name__ == "__main__":
    reset()
