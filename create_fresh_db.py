import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_fresh_database():
    """Create a fresh database for MicroMerge"""
    
    # Database connection parameters
    host = "localhost"
    port = "5432"
    username = "postgres"
    password = "suraj"
    old_db_name = "micromerge"
    new_db_name = "micromerge_fresh"
    
    try:
        # Connect to PostgreSQL server (not to a specific database)
        print("Connecting to PostgreSQL server...")
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            database="postgres"  # Connect to default postgres database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Drop the new database if it exists
        print(f"Dropping database {new_db_name} if it exists...")
        cur.execute(f"DROP DATABASE IF EXISTS {new_db_name}")
        
        # Create the new database
        print(f"Creating new database {new_db_name}...")
        cur.execute(f"CREATE DATABASE {new_db_name}")
        
        print(f"✅ Successfully created fresh database: {new_db_name}")
        
        # Close connection
        cur.close()
        conn.close()
        
        # Update the DATABASE_URL in .env file
        new_database_url = f"postgresql://{username}:{password}@{host}:{port}/{new_db_name}"
        
        # Read current .env file
        env_file_path = ".env"
        env_lines = []
        
        if os.path.exists(env_file_path):
            with open(env_file_path, 'r') as f:
                env_lines = f.readlines()
        
        # Update or add DATABASE_URL
        updated = False
        for i, line in enumerate(env_lines):
            if line.startswith("DATABASE_URL="):
                env_lines[i] = f"DATABASE_URL={new_database_url}\n"
                updated = True
                break
        
        if not updated:
            env_lines.append(f"DATABASE_URL={new_database_url}\n")
        
        # Write back to .env file
        with open(env_file_path, 'w') as f:
            f.writelines(env_lines)
        
        print(f"✅ Updated .env file with new database URL: {new_database_url}")
        
        return new_database_url
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Creating fresh MicroMerge database...")
    result = create_fresh_database()
    
    if result:
        print("\n🎉 Fresh database setup complete!")
        print("\nNext steps:")
        print("1. Run: alembic upgrade head")
        print("2. Start the server: python -m uvicorn app.main:app --reload")
    else:
        print("\n❌ Database setup failed!")