from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    __table_args__ = {'extend_existing': True}  # Fix for already existing table issue

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False, default="")  # Ensure description is set
    duration = Column(Integer, nullable=False, default=0)
    score = Column(Integer, nullable=False, default=0)

    # Relationships (if applicable)
    questions = relationship("Question", back_populates="quiz")

class Question(Base):
    __tablename__ = "questions"
    __table_args__ = {'extend_existing': True}  # Fix for already existing table issue

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    text = Column(Text, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="user")  # Ensure role is included
