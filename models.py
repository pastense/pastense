from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)  # Google user ID
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    picture = Column(String)
    created_at = Column(DateTime)

    # Relationship to page visits
    page_visits = relationship("PageVisit", back_populates="user")

class PageVisit(Base):
    __tablename__ = "page_visits"

    url = Column(String, primary_key=True)
    title = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Relationship to user
    user = relationship("User", back_populates="page_visits")
