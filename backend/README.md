# OVERMND Backend Scaffold

## Quickstart
Create `.env` next to where you run the server:
```
DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/overmnd
JWT_SECRET=CHANGE_ME
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:3001
JWT_ACCESS_MINUTES=30
JWT_REFRESH_DAYS=7
```

Install and run:
```
pip install -r ../requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Alembic
```
export DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/overmnd
alembic -c alembic/alembic.ini upgrade head
```
