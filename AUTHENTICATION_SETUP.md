# Authentication Setup Guide

This guide will help you set up Google OAuth authentication for PastTense.

## Prerequisites

1. A Google Cloud Project
2. Google OAuth 2.0 Client ID

## Step 1: Set up Google OAuth

1. **Go to Google Cloud Console:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - Your production domain
   - Add authorized redirect URIs:
     - `http://localhost:5173` (development)
     - Your production domain

4. **Get your Client ID:**
   - Copy the generated Client ID

## Step 2: Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

For the frontend, create a `.env` file in the `frontend/` directory:

```env
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

## Step 3: Install Dependencies

1. **Backend dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## Step 4: Run the Application

1. **Start the backend:**
   ```bash
   uvicorn main:app --reload
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Security Notes

- Use a strong, unique JWT secret key in production
- Only add trusted domains to OAuth authorized origins
- Store environment variables securely in production
- Consider using environment-specific configuration files

## Docker Setup

For Docker deployment, update the `docker-compose.yml` environment section:

```yaml
environment:
  - OPENAI_API_KEY=${OPENAI_API_KEY}
  - JWT_SECRET_KEY=${JWT_SECRET_KEY}
  - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
  - VITE_API_BASE_URL=http://backend:8000
  - VITE_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
```

## Troubleshooting

- **"Invalid client" error:** Check that your Client ID matches exactly
- **CORS errors:** Ensure your domain is added to authorized origins
- **Token verification fails:** Verify your Google Client ID in backend environment
- **Authentication loop:** Clear browser localStorage and try again 