import uvicorn
import sys
import os

# Add the current directory to Python path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    # For development, we'll temporarily disable the database creation
    # until PostgreSQL is properly configured
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)