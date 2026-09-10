# 🚀 AI Meeting Intelligence - Backend API

FastAPI backend providing persistent SQLite storage and REST APIs for the AI Meeting Intelligence Browser Extension.

---

## 🛠️ Tech Stack (Zero Paid APIs)

- **Framework**: FastAPI
- **ASGI Server**: Uvicorn
- **Validation**: Pydantic v2
- **Database**: SQLite3 (zero config, file-based: `meetings.db`)

---

## 🏁 Quickstart

### 1. Create a Python Virtual Environment
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the API Server
```bash
uvicorn main:app --reload --port 8000
```

The server will start at:
- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/api/health` | Health check for extension connection indicator |
| `POST` | `/api/meetings` | Create or update meeting record from extension |
| `GET` | `/api/meetings` | Retrieve list of all past meetings |
| `GET` | `/api/meetings/{id}` | Get detailed record for a specific meeting |

