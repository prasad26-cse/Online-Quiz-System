from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from pydantic import BaseModel
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models for Request Body
class UserUpdate(BaseModel):
    name: str
    email: str

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str

# Get user details
@router.get("/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"id": user.id, "name": user.name, "email": user.email}

# Update user details
@router.put("/user/{user_id}")
def update_user(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update user details
    user.name = user_data.name
    user.email = user_data.email
    db.commit()

    return {"message": "User updated successfully"}

# Change user password
@router.put("/user/{user_id}/change-password")
def change_password(user_id: int, password_data: PasswordUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(password_data.old_password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect old password")

    # Hash the new password and update
    user.password = pwd_context.hash(password_data.new_password)
    db.commit()

    return {"message": "Password updated successfully"}
