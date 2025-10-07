import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    # Connect to postgres database to create micromerge database
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="suraj"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname='micromerge'")
    if cursor.fetchone():
        print("Database 'micromerge' already exists!")
    else:
        # Create the database
        cursor.execute("CREATE DATABASE micromerge")
        print("Database 'micromerge' created successfully!")
    
    cursor.close()
    conn.close()
    
except psycopg2.Error as e:
    print(f"Error creating database: {e}")