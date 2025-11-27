import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Backend.app.database import SessionLocal, engine
from Backend.app import sql_models as models

def test_database():
    print("Testing database connection...")
    
    # Create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)
    print("✓ Tables created/verified")
    
    # Test connection
    db = SessionLocal()
    try:
        # Query users
        users = db.query(models.User).all()
        print(f"✓ Found {len(users)} users in database")
        
        # Query categories
        categories = db.query(models.Category).all()
        print(f"✓ Found {len(categories)} categories in database")
        
        # If no users, create a test user
        if len(users) == 0:
            test_user = models.User(
                email="test@smartspend.com",
                password_hash="test_hash",
                full_name="Test User",
                monthly_income=50000.0,
                currency="USD"
            )
            db.add(test_user)
            db.commit()
            print("✓ Created test user")
        
        print("\n✅ Database is working correctly!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_database()
