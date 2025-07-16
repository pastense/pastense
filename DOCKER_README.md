# Docker Setup for Pastense

This project includes Docker configurations for both the FastAPI backend and React frontend.

## Files Created

- `Dockerfile.backend` - Docker configuration for the FastAPI backend
- `frontend/Dockerfile` - Docker configuration for the React frontend  
- `docker-compose.yml` - Orchestrates both services
- `frontend/vite.config.prod.ts` - Production Vite config for Docker
- `.dockerignore` - Excludes unnecessary files from backend build
- `frontend/.dockerignore` - Excludes unnecessary files from frontend build

## Quick Start

1. **Build and run both services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in background:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

## Services

### Backend (FastAPI)
- **Port:** 8000
- **URL:** http://localhost:8000
- **Container name:** pastense-backend

### Frontend (React)
- **Port:** 5173
- **URL:** http://localhost:5173
- **Container name:** pastense-frontend

## Development

For development, you can still use the original commands:
- Backend: `uvicorn main:app --reload`
- Frontend: `cd frontend && npm run dev`

## Environment Variables

The frontend is configured to proxy API requests to the backend service within the Docker network. No additional environment variables are required for basic operation.

## Data Persistence

The backend includes a volume mount for persistent data at `./data:/app/data`. You can modify this in `docker-compose.yml` if needed.

## Troubleshooting

1. **Port conflicts:** If ports 8000 or 5173 are already in use, modify the port mappings in `docker-compose.yml`
2. **Build issues:** Run `docker-compose down` and `docker-compose up --build --force-recreate`
3. **View logs:** `docker-compose logs backend` or `docker-compose logs frontend` 