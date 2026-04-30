#!/usr/bin/env python
import sys
sys.path.insert(0, 'backend')

try:
    from app.auth import hash_password, verify_password
    print("✓ Successfully imported hash_password and verify_password")
    
    # Test hashing
    password = "test123"
    hashed = hash_password(password)
    print(f"✓ Successfully hashed password: {hashed[:20]}...")
    
    # Test verification
    is_valid = verify_password(password, hashed)
    print(f"✓ Password verification: {is_valid}")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
