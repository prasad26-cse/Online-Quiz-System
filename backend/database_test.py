from database import SessionLocal

def test_db_connection():
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        print("✅ Database connected successfully!")
    except Exception as e:
        print("❌ Database connection failed:", str(e))
    finally:
        db.close()

test_db_connection()
