from pydantic import BaseModel
from typing import List

# ✅ Define the Quiz schema
class QuizCreate(BaseModel):
    title: str
    description: str
    duration: int
    score: int = 0  # Default score

# ✅ Define the Question schema
class QuestionCreate(BaseModel):
    quiz_id: int  # Foreign key reference
    question_text: str
    options: List[str]  # List of options
    correct_option: int  # Index of correct answer (0-3)

# ✅ Define the User schema
class UserLogin(BaseModel):
    email: str
    password: str
from pydantic import BaseModel

from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str  # 'admin' or 'participant'

from pydantic import BaseModel

from pydantic import BaseModel

class QuizUpdate(BaseModel):
    title: str
    description: str
    duration: int
    score: int
