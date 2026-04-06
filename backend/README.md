# SDC Portal Backend API

This is the backend for the SDC Portal, built with FastAPI, SQLModel (SQLAlchemy + Pydantic), and SQLite.

## 🚀 Quick Start

### 1. Setup Virtual Environment
Navigate to the `backend` directory and create a virtual environment:
```powershell
# Create venv
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (CMD)
venv\Scripts\activate
```

### 2. Installation
Install the required dependencies within the virtual environment:
```bash
pip install -r requirements.txt
```

### 3. Run the Server
Start the development server with auto-reload:
```bash
# Using the venv's python directly
.\venv\Scripts\python -m uvicorn app.main:app --reload
```
- **API URL**: `http://127.0.0.1:8000`
- **Interactive Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check**: `http://127.0.0.1:8000/health`

## 🔑 Default Credentials
The database is automatically initialized with a root admin account on startup:
- **Email**: `admin@sdc.com`
- **Password**: `admin123`

## 🛠 Features

### Member Management
- **Automated Status**: Backend automatically sets member status to `PASSOUT` or `ACTIVE` based on their `retirementDate`.
- **Bulk Upload**: Admins can bulk-import members via CSV at `/api/v1/users/bulk`.
- **Self-Service**: Members can update their own `techStack` and `image` (profile picture).
- **Filtering**: Endpoint `/api/v1/users/` supports filtering by `status` (ACTIVE/PASSOUT) and `role`.

### Security
- **JWT Authentication**: Secure login flow with token-based access.
- **Role-Based Access**: Specialized endpoints for `admin` and `developer` roles.

## 📁 Project Structure
- `app/api/`: API route definitions.
- `app/core/`: Configuration and security settings.
- `app/models/`: Database models (SQLModel).
- `app/schemas/`: Pydantic validation schemas.
- `app/db/`: Database session and initialization logic.
