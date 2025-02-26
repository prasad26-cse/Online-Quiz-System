from database import engine, Base
import models  # Ensure models.py is imported so SQLAlchemy can detect tables

print("🔄 Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
