# from fastapi import FastAPI, Depends, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import mysql.connector
# import logging
# from auth import router as auth_router

# # Initialize FastAPI App
# app = FastAPI()

# # ✅ Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Replace "*" with frontend URL if needed
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ✅ Include authentication router
# app.include_router(auth_router, prefix="/auth", tags=["Auth"])

# # ✅ Logging setup
# logging.basicConfig(level=logging.INFO)

# # ✅ Database Dependency
# def get_db():
#     try:
#         db = mysql.connector.connect(
#             host="localhost",
#             user="root",
#             password="Prasad",
#             database="quiz_system"
#         )
#         logging.info("✅ Database connection established.")
#         yield db
#     except mysql.connector.Error as err:
#         logging.error(f"❌ Database connection error: {err}")
#         raise HTTPException(status_code=500, detail="Database connection failed")
#     finally:
#         if 'db' in locals() and db.is_connected():
#             db.close()
#             logging.info("✅ Database connection closed.")

# # ✅ Quiz Models (Request Body Validation)
# class QuizCreate(BaseModel):
#     title: str
#     description: str
#     duration: int
#     score: int

# class QuizUpdate(BaseModel):
#     title: str
#     description: str
#     duration: int
#     score: int

# # ✅ API to fetch **all quizzes**
# @app.get("/quizzes/")
# def get_quizzes(db=Depends(get_db)):
#     try:
#         cursor = db.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM quizzes")  # ✅ Fix 404 issue
#         quizzes = cursor.fetchall()

#         if not quizzes:
#             logging.warning("⚠ No quizzes found in the database.")
#             return {"quizzes": []}  # ✅ Return empty list instead of error

#         return {"quizzes": quizzes}

#     except Exception as e:
#         logging.error(f"❌ Error fetching quizzes: {e}")
#         raise HTTPException(status_code=500, detail="Error fetching quizzes")

# # ✅ API to fetch **quiz questions**
# # ✅ API to fetch quiz questions (Fix for View Questions button)
# @app.get("/quizzes/{quiz_id}/questions")
# def get_quiz_questions(quiz_id: int, db=Depends(get_db)):
#     try:
#         cursor = db.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM questions WHERE quiz_id = %s", (quiz_id,))
#         questions = cursor.fetchall()

#         return {"quiz_id": quiz_id, "questions": questions}
#     except Exception as e:
#         logging.error(f"Error fetching questions for quiz {quiz_id}: {e}")
#         raise HTTPException(status_code=500, detail="Error fetching questions")


# # ✅ API to create a new quiz
# @app.post("/quizzes/")
# def create_quiz(quiz: QuizCreate, db=Depends(get_db)):
#     try:
#         cursor = db.cursor(dictionary=True)
#         sql = "INSERT INTO quizzes (title, description, duration, score) VALUES (%s, %s, %s, %s)"
#         values = (quiz.title, quiz.description, quiz.duration, quiz.score)
#         cursor.execute(sql, values)
#         db.commit()
#         quiz_id = cursor.lastrowid
#         return {"message": "Quiz created successfully", "quiz_id": quiz_id}
    
#     except Exception as e:
#         logging.error(f"❌ Error creating quiz: {e}")
#         raise HTTPException(status_code=500, detail="Error creating quiz")

# # ✅ API to update a quiz
# @app.put("/quizzes/{quiz_id}")
# def update_quiz(quiz_id: int, quiz_data: QuizUpdate, db=Depends(get_db)):
#     try:
#         cursor = db.cursor(dictionary=True)

#         # ✅ Check if quiz exists
#         cursor.execute("SELECT * FROM quizzes WHERE id = %s", (quiz_id,))
#         existing_quiz = cursor.fetchone()

#         if not existing_quiz:
#             raise HTTPException(status_code=404, detail="Quiz not found")

#         sql = "UPDATE quizzes SET title = %s, description = %s, duration = %s, score = %s WHERE id = %s"
#         values = (quiz_data.title, quiz_data.description, quiz_data.duration, quiz_data.score, quiz_id)
#         cursor.execute(sql, values)
#         db.commit()

#         return {"message": "Quiz updated successfully"}
    
#     except Exception as e:
#         logging.error(f"❌ Error updating quiz: {e}")
#         raise HTTPException(status_code=500, detail="Error updating quiz")

# # ✅ API to delete a quiz
# @app.delete("/quizzes/{quiz_id}")
# def delete_quiz(quiz_id: int, db=Depends(get_db)):
#     try:
#         cursor = db.cursor(dictionary=True)
        
#         # ✅ Check if quiz exists
#         cursor.execute("SELECT * FROM quizzes WHERE id = %s", (quiz_id,))
#         existing_quiz = cursor.fetchone()

#         if not existing_quiz:
#             raise HTTPException(status_code=404, detail="Quiz not found")

#         # ✅ Delete all questions related to the quiz (Foreign key constraint)
#         cursor.execute("DELETE FROM questions WHERE quiz_id = %s", (quiz_id,))
#         db.commit()

#         # ✅ Delete the quiz
#         cursor.execute("DELETE FROM quizzes WHERE id = %s", (quiz_id,))
#         db.commit()

#         return {"message": "Quiz deleted successfully"}
    
#     except Exception as e:
#         db.rollback()  # ✅ Ensure rollback on failure
#         logging.error(f"❌ Error deleting quiz: {e}")
#         raise HTTPException(status_code=500, detail="Error deleting quiz")

# # ✅ Root API
# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the Quiz API 🎯"}
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import logging
from auth import router as auth_router
from security import get_current_user  # ✅ Import security functions
from models import User

# Initialize FastAPI App
app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
app.include_router(auth_router, prefix="/auth", tags=["Auth"])

# ✅ Logging setup
logging.basicConfig(level=logging.INFO)

# ✅ Database Dependency
def get_db():
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Prasad",
            database="quiz_system"
        )
        logging.info("✅ Database connection established.")
        yield db
    except mysql.connector.Error as err:
        logging.error(f"❌ Database connection error: {err}")
        raise HTTPException(status_code=500, detail="Database connection failed")
    finally:
        if 'db' in locals() and db.is_connected():
            db.close()
            logging.info("✅ Database connection closed.")

# ✅ Quiz Models (Request Body Validation)
class QuizCreate(BaseModel):
    title: str
    description: str
    duration: int
    score: int

class QuizUpdate(BaseModel):
    title: str
    description: str
    duration: int
    score: int

from pydantic import BaseModel

class ParticipationCreate(BaseModel):
    user_name: str  # ✅ Accept username instead of user_id
    quiz_id: int
    score: int
from sqlalchemy.orm import Session
@app.get("/user/profile")
def get_user_profile(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"name": user.name, "role": user.role}

# ✅ API to fetch **all quizzes**
@app.get("/quizzes/")
def get_quizzes(db=Depends(get_db)):
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM quizzes")
        quizzes = cursor.fetchall()

        if not quizzes:
            logging.warning("⚠ No quizzes found in the database.")
            return {"quizzes": []}  

        return {"quizzes": quizzes}

    except Exception as e:
        logging.error(f"❌ Error fetching quizzes: {e}")
        raise HTTPException(status_code=500, detail="Error fetching quizzes")

# ✅ API to fetch **quiz questions**
@app.get("/quizzes/{quiz_id}/questions")
def get_quiz_questions(quiz_id: int, db=Depends(get_db)):
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM questions WHERE quiz_id = %s", (quiz_id,))
        questions = cursor.fetchall()

        return {"quiz_id": quiz_id, "questions": questions}
    except Exception as e:
        logging.error(f"Error fetching questions for quiz {quiz_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching questions")

# ✅ API to create a new quiz
@app.post("/quizzes/")
def create_quiz(quiz: QuizCreate, db=Depends(get_db)):
    try:
        cursor = db.cursor(dictionary=True)
        sql = "INSERT INTO quizzes (title, description, duration, score) VALUES (%s, %s, %s, %s)"
        values = (quiz.title, quiz.description, quiz.duration, quiz.score)
        cursor.execute(sql, values)
        db.commit()
        quiz_id = cursor.lastrowid
        return {"message": "Quiz created successfully", "quiz_id": quiz_id}
    
    except Exception as e:
        logging.error(f"❌ Error creating quiz: {e}")
        raise HTTPException(status_code=500, detail="Error creating quiz")

# ✅ API to update a quiz
@app.put("/quizzes/{quiz_id}")
def update_quiz(quiz_id: int, quiz_data: QuizUpdate, db=Depends(get_db)):
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM quizzes WHERE id = %s", (quiz_id,))
        existing_quiz = cursor.fetchone()

        if not existing_quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        sql = "UPDATE quizzes SET title = %s, description = %s, duration = %s, score = %s WHERE id = %s"
        values = (quiz_data.title, quiz_data.description, quiz_data.duration, quiz_data.score, quiz_id)
        cursor.execute(sql, values)
        db.commit()

        return {"message": "Quiz updated successfully"}
    
    except Exception as e:
        logging.error(f"❌ Error updating quiz: {e}")
        raise HTTPException(status_code=500, detail="Error updating quiz")

# ✅ API to delete a quiz
@app.delete("/quizzes/{quiz_id}")
def delete_quiz(quiz_id: int, db=Depends(get_db)):
    try:
        cursor = db.cursor(dictionary=True)
        
        # ✅ Check if quiz exists
        cursor.execute("SELECT * FROM quizzes WHERE id = %s", (quiz_id,))
        existing_quiz = cursor.fetchone()

        if not existing_quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # ✅ Delete all participation records for the quiz (to avoid foreign key constraint issues)
        cursor.execute("DELETE FROM participation WHERE quiz_id = %s", (quiz_id,))
        db.commit()

        # ✅ Delete all questions related to the quiz
        cursor.execute("DELETE FROM questions WHERE quiz_id = %s", (quiz_id,))
        db.commit()

        # ✅ Delete the quiz
        cursor.execute("DELETE FROM quizzes WHERE id = %s", (quiz_id,))
        db.commit()

        return {"message": "Quiz deleted successfully"}
    
    except Exception as e:
        db.rollback()  
        logging.error(f"❌ Error deleting quiz: {e}")
        raise HTTPException(status_code=500, detail="Error deleting quiz")

# ✅ API to save quiz participation
@app.post("/participation/")
def save_participation(data: ParticipationCreate, db=Depends(get_db)):
    try:
        cursor = db.cursor(dictionary=True)

        # ✅ Insert username instead of user_id
        sql = "INSERT INTO participation (user_name, quiz_id, score) VALUES (%s, %s, %s)"
        values = (data.user_name, data.quiz_id, data.score)
        cursor.execute(sql, values)
        db.commit()

        return {"message": "Participation recorded successfully!"}

    except Exception as e:
        db.rollback()
        logging.error(f"❌ Error saving participation: {e}")
        raise HTTPException(status_code=500, detail="Error saving participation")


# ✅ API to fetch participation records
@app.get("/participation/")
def get_participation(db=Depends(get_db)):
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT participation.id, participation.user_name, quizzes.title AS quiz_title, 
                   participation.score, participation.participation_date
            FROM participation
            JOIN quizzes ON participation.quiz_id = quizzes.id
            ORDER BY participation.participation_date DESC
        """)
        records = cursor.fetchall()

        return {"participation": records}
    except Exception as e:
        logging.error(f"❌ Error fetching participation records: {e}")
        raise HTTPException(status_code=500, detail="Error fetching participation records")

# ✅ Root API
@app.get("/")
def read_root():
    return {"message": "Welcome to the Quiz API 🎯"}
