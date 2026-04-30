"""
Clear Test Data Script
Removes any test users from the database to ensure clean production start
"""
from app.database import SessionLocal, init_db
from app.models import User, Report, RecommendationHistory, ComparisonReport

def clear_test_data():
    """Remove test users and their associated data"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("🧹 CLEARING TEST DATA")
        print("=" * 60)
        
        # Count existing data
        user_count = db.query(User).count()
        report_count = db.query(Report).count()
        
        print(f"\n📊 Current Database State:")
        print(f"   Users: {user_count}")
        print(f"   Reports: {report_count}")
        
        if user_count == 0:
            print("\n✅ Database is already clean - no test data found")
            return
        
        # Ask for confirmation
        print(f"\n⚠️  WARNING: This will delete ALL {user_count} users and their data!")
        response = input("   Continue? (yes/no): ").strip().lower()
        
        if response != 'yes':
            print("\n❌ Operation cancelled")
            return
        
        # Delete all data (cascade will handle related records)
        deleted_users = db.query(User).delete()
        db.commit()
        
        print(f"\n✅ Successfully deleted {deleted_users} users and their associated data")
        print("✅ Database is now clean and ready for production users")
        
    except Exception as e:
        print(f"\n❌ Error clearing data: {e}")
        db.rollback()
    finally:
        db.close()
        print("\n" + "=" * 60)


def verify_clean_database():
    """Verify database is clean"""
    db = SessionLocal()
    
    try:
        user_count = db.query(User).count()
        report_count = db.query(Report).count()
        
        print("\n📊 Database Verification:")
        print(f"   Users: {user_count}")
        print(f"   Reports: {report_count}")
        
        if user_count == 0 and report_count == 0:
            print("   ✅ Database is clean!")
        else:
            print("   ⚠️  Database still contains data")
            
    finally:
        db.close()


if __name__ == "__main__":
    # Initialize database (create tables if they don't exist)
    init_db()
    
    # Clear test data
    clear_test_data()
    
    # Verify
    verify_clean_database()
    
    print("\n🎉 Ready for production users!")
    print("   Users can now sign up at: http://localhost:3000")
