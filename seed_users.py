from sqlalchemy.orm import Session
from Backend.app.database import SessionLocal, engine
from Backend.app import sql_models as models
from datetime import datetime
import random

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def seed_users():
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(models.User).count() > 5:
            print("Database already has users. Skipping seed.")
            return

        names = [
            "Emma Wilson", "Liam Johnson", "Olivia Brown", "Noah Davis", "Ava Miller",
            "Sophia Garcia", "Mason Rodriguez", "Isabella Martinez", "Jacob Hernandez", "Mia Lopez",
            "William Gonzalez", "Charlotte Perez", "James Wilson", "Amelia Anderson", "Benjamin Thomas",
            "Harper Taylor", "Lucas Moore", "Evelyn Jackson", "Henry Martin", "Ella Lee"
        ]

        for i, name in enumerate(names):
            email = f"{name.lower().replace(' ', '.')}@example.com"
            is_premium = random.choice([True, False])
            
            user = models.User(
                email=email,
                password_hash="hashed_password_demo",
                full_name=name,
                phone=f"+1 555 01{i:02d}",
                is_premium_member=is_premium,
                profile_image=f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=random"
            )
            db.add(user)
        
        db.commit()
        print(f"Successfully added {len(names)} dummy users!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
