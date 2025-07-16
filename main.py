from fastapi import FastAPI, Body, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models import PageVisit, User
from db import Base, engine, SessionLocal
from pydantic import BaseModel
from datetime import datetime, timedelta
from processing import clean_content
from typing import Optional
import jwt
from jwt.exceptions import InvalidTokenError
import os
from google.auth.transport import requests
from google.oauth2 import id_token

from embedding import get_embedding
from vector_dao import index, id_map, add_to_vector_store
import numpy as np

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(user_id: str = Depends(verify_token)) -> User:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return user
    finally:
        db.close()

class SearchQuery(BaseModel):
    q: str
    k: int = 5

class PageVisitInput(BaseModel):
    url: str
    title: str
    content: str
    timestamp: str

class GoogleLoginRequest(BaseModel):
    credential: str

@app.post("/auth/google")
def authenticate_with_google(login_request: GoogleLoginRequest):
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            login_request.credential, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        # Extract user information
        google_user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']
        picture = idinfo.get('picture', '')

        # Get or create user in database
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == google_user_id).first()
            if not user:
                user = User(
                    id=google_user_id,
                    email=email,
                    name=name,
                    picture=picture,
                    created_at=datetime.utcnow()
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            # Create JWT token
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={
                    "sub": user.id,
                    "email": user.email,
                    "name": user.name,
                    "picture": user.picture
                },
                expires_delta=access_token_expires
            )

            return {"access_token": access_token, "token_type": "bearer"}

        finally:
            db.close()

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )

@app.post("/page_visit")
def store_page(visit: PageVisitInput, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    try:
        page = PageVisit(
            url=visit.url,
            title=visit.title,
            content=visit.content,
            timestamp=datetime.fromisoformat(visit.timestamp.replace("Z", "")),
            user_id=current_user.id
        )
        db.merge(page)
        db.commit()

        try:
            cleaned_content = clean_content(visit.content)
            embedding = get_embedding(cleaned_content)
            # Include user_id in the vector store key to isolate user data
            user_url_key = f"{current_user.id}:{visit.url}"
            add_to_vector_store(user_url_key, embedding)
        except Exception as e:
            print("Embedding or FAISS add failed:", e)

        return {"status": "stored + embedded"}
    finally:
        db.close()

@app.post("/semantic_search")
def semantic_search(searchQuery: SearchQuery, current_user: User = Depends(get_current_user)):
    q = searchQuery.q
    k = searchQuery.k
    query_vec = np.array(get_embedding(q), dtype='float32').reshape(1, -1)
    D, I = index.search(query_vec, k)

    results = []
    user_prefix = f"{current_user.id}:"
    
    for idx in I[0]:
        if idx < len(id_map):
            stored_key = id_map[idx]
            # Only return results that belong to the current user
            if stored_key.startswith(user_prefix):
                # Remove the user prefix to get the original URL
                original_url = stored_key[len(user_prefix):]
                results.append({"url": original_url})
    
    return {"results": results}

@app.post("/show_results")
def show_results(urls: list[str] = Body(...), current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    try:
        results = []

        for url in urls:
            # Only return results that belong to the current user
            record = db.query(PageVisit).filter_by(url=url, user_id=current_user.id).first()
            if record:
                results.append({
                    "url": record.url,
                    "title": record.title,
                    "favicon": f"https://www.google.com/s2/favicons?sz=64&domain={record.url}"
                })
        
        return {"results": results}
    finally:
        db.close()