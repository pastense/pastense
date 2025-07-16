# PastTense FastAPI - Semantic Search for Web Page Visits

A FastAPI-based semantic search engine that stores web page visit data and enables intelligent search through visited content using OpenAI embeddings and FAISS vector database.

## 🌟 Features

- **🔐 Google OAuth Authentication**: Secure user authentication with Google accounts
- **👤 User Data Isolation**: Each user's data is completely separate and private
- **📝 Page Visit Storage**: Store web page visits with URL, title, content, and timestamp
- **🔍 Semantic Search**: Find similar pages using AI-powered semantic search
- **🚀 Vector Database**: Fast similarity search using FAISS (Facebook AI Similarity Search)
- **🤖 OpenAI Integration**: Generate high-quality embeddings using OpenAI's text-embedding-3-small model
- **📡 REST API**: Clean FastAPI endpoints with JWT authentication
- **🌐 CORS Support**: Cross-origin requests enabled for frontend integration
- **💻 Modern Frontend**: React TypeScript UI with Tailwind CSS, glassmorphism design and responsive layout

## 🏗️ Architecture

The application consists of several key components:

### Core Files

- **`main.py`**: FastAPI application with three main endpoints
- **`models.py`**: SQLAlchemy model for PageVisit data
- **`db.py`**: Database configuration and session management
- **`embedding.py`**: OpenAI embedding generation
- **`vector_dao.py`**: FAISS vector database operations
- **`processing.py`**: Text cleaning and preprocessing utilities

### Data Flow

1. **Store Page Visit** → Clean content → Generate embedding → Store in both SQL and vector DB
2. **Semantic Search** → Generate query embedding → Search FAISS index → Return similar URLs
3. **Show Results** → Query SQL database → Return detailed page information

## 🔐 Authentication Setup (Required)

Before running the application, you must set up Google OAuth authentication and environment variables.

### Step 1: Google Cloud Console Setup

1. **Create Google Cloud Project:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Note your project name/ID

2. **Enable Required APIs:**
   - Go to "APIs & Services" → "Library"
   - Search for and enable:
     - "Google+ API" or "Google Identity Services"
     - "Google OAuth2 API"

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Set **Name**: "PastTense App" (or your preferred name)
   
4. **Configure Authorized Origins:**
   Add these **exact URLs** to "Authorized JavaScript origins":
   ```
   http://localhost:5173
   http://localhost:3000
   ```
   
5. **Configure Redirect URIs (Optional):**
   Add to "Authorized redirect URIs":
   ```
   http://localhost:5173
   ```

6. **Copy Your Client ID:**
   - After creating, copy the Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
   - **Keep this secure** - you'll need it for environment setup

### Step 2: Environment Variables Setup

#### Backend Environment (.env in root directory)

1. **Copy template to create .env file:**
   ```bash
   cp env.template .env
   ```

2. **Edit .env file with your actual values:**
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_actual_openai_api_key_here
   
   # JWT Configuration (generate a strong secret)
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

#### Frontend Environment (frontend/.env)

1. **Copy frontend template:**
   ```bash
   cd frontend
   cp env.template .env
   ```

2. **Edit frontend/.env file:**
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:8000
   
   # Google OAuth Configuration (same Client ID as backend)
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

### Step 3: Generate Secure JWT Secret

Generate a secure JWT secret key using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET_KEY` in the backend `.env` file.

### Step 4: Verify Setup

1. **Check file locations:**
   ```
   pastense/
   ├── .env                    # Backend environment
   ├── env.template            # Backend template
   └── frontend/
       ├── .env                # Frontend environment  
       └── env.template        # Frontend template
   ```

2. **Verify environment variables:**
   - Backend `.env`: Contains OPENAI_API_KEY, JWT_SECRET_KEY, GOOGLE_CLIENT_ID
   - Frontend `.env`: Contains VITE_API_BASE_URL, VITE_GOOGLE_CLIENT_ID
   - Both use the **same** Google Client ID

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API key
- Google Cloud Project with OAuth 2.0 credentials
- Basic understanding of environment variables

### Installation & Setup

⚠️ **Important:** Complete the [🔐 Authentication Setup](#-authentication-setup-required) section above before proceeding.

1. **Clone the repository**
```bash
git clone <repository-url>
cd pastense
```

2. **Set up environment variables** (Required)
```bash
# Backend environment
cp env.template .env
# Edit .env with your OpenAI API key, JWT secret, and Google Client ID

# Frontend environment  
cd frontend
cp env.template .env
# Edit .env with your Google Client ID
cd ..
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Install Frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

5. **Run the backend**
```bash
uvicorn main:app --reload
```

6. **Run the frontend** (in a new terminal)
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: `http://localhost:5173` 
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### Docker Setup (Alternative)

If you prefer using Docker:

1. **Complete Authentication Setup** (required - see above section)

2. **Create environment files** from templates (required for Docker)
```bash
cp env.template .env
cd frontend && cp env.template .env && cd ..
# Edit both .env files with your actual values
```

3. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

**Docker URLs:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

**Note:** Environment variables are automatically passed to containers from your `.env` files.

## 📚 API Endpoints

### 1. Store Page Visit
**POST** `/page_visit`

Store a web page visit and generate embeddings for semantic search.

```json
{
  "url": "https://example.com",
  "title": "Example Page",
  "content": "Page content here...",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Response:**
```json
{
  "status": "stored + embedded"
}
```

### 2. Semantic Search
**POST** `/semantic_search`

Search for semantically similar pages using natural language queries.

```json
{
  "q": "machine learning tutorials",
  "k": 5
}
```

**Response:**
```json
{
  "results": [
    {"url": "https://example.com/ml-tutorial"},
    {"url": "https://example.com/ai-guide"}
  ]
}
```

### 3. Show Results
**POST** `/show_results`

Get detailed information about specific URLs.

```json
["https://example.com/page1", "https://example.com/page2"]
```

**Response:**
```json
{
  "results": [
    {
      "url": "https://example.com/page1",
      "title": "Page Title",
      "favicon": "https://www.google.com/s2/favicons?sz=64&domain=https://example.com/page1"
    }
  ]
}
```

## 🔧 Technical Details

### Database Schema

**PageVisit Model:**
- `url` (String, Primary Key): The visited page URL
- `title` (String): Page title
- `content` (Text): Page content
- `timestamp` (DateTime): When the page was visited

### Vector Database

- **Engine**: FAISS IndexFlatL2 for cosine similarity search
- **Dimension**: 1536 (OpenAI text-embedding-3-small)
- **Storage**: Persistent storage to `faiss.index` and `vector_ids.pkl`
- **Normalization**: L2 normalization for better similarity matching

### Text Processing

The `processing.py` module cleans content by:
- Stripping whitespace
- Collapsing multiple spaces
- Removing cookie banners and newsletter prompts
- Truncating to 5000 characters for OpenAI limits

### Embedding Generation

- **Model**: OpenAI's `text-embedding-3-small`
- **Input limit**: 1000 characters (truncated if longer)
- **Output**: 1536-dimensional vector

## 📁 File Structure

```
pastense-fastapi/
├── main.py              # FastAPI application and endpoints
├── models.py            # SQLAlchemy models
├── db.py                # Database configuration
├── embedding.py         # OpenAI embedding integration
├── vector_dao.py        # FAISS vector operations
├── processing.py        # Text cleaning utilities
├── dao.py               # (Currently unused)
├── requirements.txt     # Python dependencies
├── frontend/            # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   └── services/    # API service layer
│   ├── package.json     # Frontend dependencies
│   └── README.md        # Frontend documentation
├── .github/             # GitHub issue templates
└── README.md           # This file
```

## 🛠️ Dependencies

Key dependencies include:
- **FastAPI**: Web framework
- **SQLAlchemy**: Database ORM
- **OpenAI**: Embedding generation
- **FAISS**: Vector similarity search
- **NumPy**: Numerical operations
- **python-dotenv**: Environment variable management

## 🚨 Important Notes

- The SQLite database (`visits.db`) and FAISS files (`faiss.index`, `vector_ids.pkl`) are created automatically
- Ensure your OpenAI API key has sufficient credits for embedding generation
- The application includes CORS middleware allowing all origins (adjust for production)
- Content is truncated to fit OpenAI's token limits

## 🌐 Web Interface

Once both backend and frontend are running:

1. **Visit the web app**: Navigate to `http://localhost:5173`
2. **Add page visits**: Use the "Add Page Visit" tab to store web pages
3. **Search semantically**: Use the "Search Pages" tab to find relevant content using natural language

## 📖 API Documentation

For developers, visit `http://localhost:8000/docs` for interactive API documentation powered by FastAPI's automatic OpenAPI generation.

## 🛠️ Troubleshooting

### Google OAuth Issues

#### "The OAuth client was not found" Error
1. **Check Client ID format:** Must end with `.apps.googleusercontent.com`
2. **Verify environment variables:**
   ```javascript
   // In browser console at http://localhost:5173
   console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
   ```
3. **Restart development servers** after changing `.env` files
4. **Wait 5-10 minutes** for Google Console changes to propagate

#### "The given origin is not allowed" Error
1. **Check Google Cloud Console:**
   - Go to APIs & Services → Credentials → Your OAuth Client
   - Verify "Authorized JavaScript origins" contains exactly:
     - `http://localhost:5173`
     - `http://localhost:3000` (optional)
2. **Check URL format:**
   - ✅ Correct: `http://localhost:5173`
   - ❌ Wrong: `https://localhost:5173` (no HTTPS)
   - ❌ Wrong: `http://localhost:5173/` (no trailing slash)

#### "ERR_BLOCKED_BY_CLIENT" Error
1. **Disable ad blockers** for localhost:5173
2. **Try incognito/private mode**
3. **Check browser extensions** that might block Google services
4. **Clear browser cache:** Ctrl+Shift+R (or Cmd+Shift+R on Mac)

### Environment Variable Issues

#### Variables Not Loading
1. **Check file locations:**
   ```
   pastense/.env              # Backend environment
   pastense/frontend/.env     # Frontend environment
   ```
2. **Check file format:**
   ```env
   # No spaces around equals sign
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   # No quotes around values
   ```
3. **Restart both servers** after changing .env files

#### JWT Secret Generation
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Docker Issues

#### Environment Variables in Docker
Update your `.env` file and rebuild:
```bash
docker-compose down
docker-compose up --build
```

### Port Conflicts

If ports 5173 or 8000 are in use:
```bash
# Frontend on different port
cd frontend
npm run dev -- --port 3000

# Backend on different port
uvicorn main:app --reload --port 8001
```

Update your Google Console authorized origins accordingly.

### Debug Mode

Enable debug logging in browser console:
```javascript
// Check all environment variables
console.log('All env vars:', import.meta.env);

// Check current origin
console.log('Current origin:', window.location.origin);
```

## 🚨 Common Setup Mistakes

1. **❌ Using HTTPS in authorized origins** (use HTTP for localhost)
2. **❌ Adding trailing slashes** to URLs in Google Console
3. **❌ Not restarting servers** after changing environment variables
4. **❌ Using different Client IDs** in frontend and backend .env files
5. **❌ Forgetting to enable APIs** in Google Cloud Console
6. **❌ Not waiting** for Google Console changes to propagate (5-10 minutes)

## 🔐 Security Notes

- **Production:** Use HTTPS and update authorized origins accordingly
- **Environment Variables:** Never commit `.env` files to version control
- **JWT Secret:** Generate a strong, unique secret for production
- **Google Console:** Only add trusted domains to authorized origins
