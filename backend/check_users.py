#!/usr/bin/env python
"""Check and optionally clear users from database"""
import sys
sys.path.insert(0, '.')

from app.database import SessionLocal
from app.models import User

db = SessionLocal()

# Get all users
users = db.query(User).all()
print(f"\n📊 Total users in database: {len(users)}\n")

for user in users:
    print(f"  - Email: {user.email}")
    print(f"    Username: {user.username}")
    print(f"    Created: {user.created_at}")
    print()

# Check for specific user
target_email = "aditi1411ss@gmail.com"
target_username = "adi14"

existing_email = db.query(User).filter(User.email == target_email).first()
existing_username = db.query(User).filter(User.username == target_username).first()

if existing_email:
    print(f"⚠️  User with email '{target_email}' already exists!")
    print(f"   ID: {existing_email.id}, Username: {existing_email.username}")
    
if existing_username:
    print(f"⚠️  User with username '{target_username}' already exists!")
    print(f"   ID: {existing_username.id}, Email: {existing_username.email}")

db.close()
