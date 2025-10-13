#!/usr/bin/env python3
"""
Database Flush Script for MicroMerge Platform
Clears all existing data and resets the database to a fresh state.
"""

import sys
import os
from sqlalchemy import text
from sqlalchemy.orm import Session

# Add the parent directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import engine, get_db
from app import models

def flush_database():
    """Flush all data from the database and reset to fresh state."""
    print("🗑️  Starting database flush operation...")
    
    try:
        # Create a direct connection to the database
        with engine.begin() as connection:
            print("📋 Dropping existing data from all tables...")
            
            # Get all table names in reverse order of dependencies
            tables_to_clear = [
                'credentials',
                'badge_templates', 
                'issuer_profiles',
                'employer_profiles',
                'users'
            ]
            
            # Disable foreign key constraints temporarily (for SQLite)
            if 'sqlite' in str(engine.url):
                connection.execute(text("PRAGMA foreign_keys = OFF"))
            
            # Clear data from each table
            for table in tables_to_clear:
                try:
                    result = connection.execute(text(f"DELETE FROM {table}"))
                    print(f"  ✅ Cleared {result.rowcount} records from {table}")
                except Exception as e:
                    print(f"  ⚠️  Warning: Could not clear {table}: {e}")
            
            # Reset auto-increment counters (for SQLite)
            if 'sqlite' in str(engine.url):
                for table in tables_to_clear:
                    try:
                        connection.execute(text(f"DELETE FROM sqlite_sequence WHERE name='{table}'"))
                    except Exception as e:
                        pass  # Table might not have auto-increment
                
                # Re-enable foreign key constraints
                connection.execute(text("PRAGMA foreign_keys = ON"))
            
            print("🔄 Recreating database tables...")
            # Drop and recreate all tables to ensure clean schema
            models.Base.metadata.drop_all(bind=engine)
            models.Base.metadata.create_all(bind=engine)
            
        print("\n✅ Database flush completed successfully!")
        print("🎉 Your database is now completely clean and ready for fresh data.")
        
    except Exception as e:
        print(f"\n❌ Error during database flush: {e}")
        return False
    
    return True

def verify_clean_state():
    """Verify that the database is in a clean state."""
    print("\n🔍 Verifying clean database state...")
    
    try:
        with engine.begin() as connection:
            tables_to_check = ['users', 'credentials', 'badge_templates', 'issuer_profiles', 'employer_profiles']
            
            all_clean = True
            for table in tables_to_check:
                try:
                    result = connection.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = result.scalar()
                    if count == 0:
                        print(f"  ✅ {table}: 0 records (clean)")
                    else:
                        print(f"  ⚠️  {table}: {count} records (not clean)")
                        all_clean = False
                except Exception as e:
                    print(f"  ❌ {table}: Error checking - {e}")
                    all_clean = False
            
            if all_clean:
                print("\n🎊 Database verification successful - completely clean!")
            else:
                print("\n⚠️  Database may not be completely clean. Please check manually.")
                
    except Exception as e:
        print(f"\n❌ Error during verification: {e}")

def show_database_info():
    """Show current database connection info."""
    print(f"🔗 Database URL: {engine.url}")
    print(f"📊 Database Type: {engine.dialect.name}")
    
    if 'sqlite' in str(engine.url):
        db_path = str(engine.url).replace('sqlite:///', '')
        if os.path.exists(db_path):
            size = os.path.getsize(db_path)
            print(f"💾 Database File Size: {size:,} bytes")
        else:
            print("💾 Database File: Not found (will be created)")

if __name__ == "__main__":
    print("=" * 60)
    print("    MicroMerge Database Flush Utility")
    print("=" * 60)
    
    show_database_info()
    
    print("\n⚠️  WARNING: This will permanently delete ALL data!")
    print("   - All users and credentials will be removed")
    print("   - All badge templates will be deleted") 
    print("   - All profiles and settings will be cleared")
    print("   - This action CANNOT be undone!")
    
    response = input("\n❓ Are you sure you want to proceed? (type 'YES' to confirm): ")
    
    if response.strip().upper() == 'YES':
        print("\n🚀 Starting database flush...")
        
        if flush_database():
            verify_clean_state()
            
            print("\n" + "=" * 60)
            print("✅ DATABASE FLUSH COMPLETE!")
            print("=" * 60)
            print("Your MicroMerge database is now completely fresh and clean.")
            print("You can now:")
            print("  1. Start the backend server: python run.py")
            print("  2. Start the frontend: cd frontend && npm run dev")
            print("  3. Create new demo accounts through the registration page")
            print("  4. Test all features with fresh data")
        else:
            print("\n❌ Database flush failed. Please check the errors above.")
    else:
        print("\n🛑 Database flush cancelled - no changes made.")
        print("Your data is safe!")