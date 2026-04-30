#!/usr/bin/env python
import sys
sys.path.insert(0, 'backend')

try:
    from app.database import SessionLocal
    from app.models import User
    from app.auth import hash_password
    
    print("✓ Successfully imported database and models")
    
    # Create session
    db = SessionLocal()
    print("✓ Database session created")
    
    # Try to create a user
    test_user = User(
        email="dbtest@example.com",
        username="dbtest",
        password_hash=hash_password("test123")
    )
    
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    
    print(f"✓ Successfully created user: {test_user.email} (ID: {test_user.id})")
    
    # Clean up
    db.delete(test_user)
    db.commit()
    print("✓ Successfully deleted test user")
    
    db.close()
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
