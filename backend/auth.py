from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User
from database import get_db
from schemas import UserLogin, UserRegister
from passlib.context import CryptContext
from jose import jwt

router = APIRouter()  # ✅ Use router instead of app

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your_secret_key"  # ⚠️ Move this to environment variables in production

# ✅ Register User Route
@router.post("/register")
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "role": new_user.role}

# ✅ Login Route (Fixed)
@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not pwd_context.verify(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # ✅ Print user role to check what is being fetched
    print(f"User found: {user.email}, Role: {user.role}")  

    # ✅ Return the actual role from the database
    token = jwt.encode({"email": user.email, "role": user.role}, SECRET_KEY, algorithm="HS256")
    return {"token": token, "role": user.role}

