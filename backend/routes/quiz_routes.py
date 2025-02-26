from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Quiz, Question
from schemas import QuizCreate, QuizUpdate, QuestionCreate

quiz_router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

# ✅ Create a new quiz
@quiz_router.post("/", response_model=QuizCreate)
def create_quiz(quiz_data: QuizCreate, db: Session = Depends(get_db)):
    new_quiz = Quiz(title=quiz_data.title, duration=quiz_data.duration, score=quiz_data.score)
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)
    return new_quiz

# ✅ Get all quizzes
@quiz_router.get("/")
def get_quizzes(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).all()
    if not quizzes:
        raise HTTPException(status_code=404, detail="No quizzes found")
    return quizzes

# ✅ Update a quiz by ID
@quiz_router.put("/{quiz_id}")
def update_quiz(quiz_id: int, quiz_data: QuizUpdate, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz.title = quiz_data.title
    quiz.duration = quiz_data.duration
    quiz.score = quiz_data.score

    db.commit()
    db.refresh(quiz)
    return quiz

# ✅ Add a question to a quiz
@quiz_router.post("/{quiz_id}/questions/")
def add_question(quiz_id: int, question_data: QuestionCreate, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    new_question = Question(
        quiz_id=quiz_id,
        question_text=question_data.question_text,
        options=",".join(question_data.options),  # Convert list to comma-separated string
        correct_option=question_data.correct_option
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

# ✅ Get questions for a quiz
@quiz_router.get("/{quiz_id}/questions/")
def get_quiz_questions(quiz_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this quiz")
    
    return [{"id": q.id, "question": q.question_text, "options": q.options.split(","), "correct": q.correct_option} for q in questions]
