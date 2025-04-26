#!/usr/bin/env python3
"""
Database initialization script for LearnScope backend
This script initializes the SQLite database with the required tables
"""

from backend.main import app, init_db

def main():
    """Run the database initialization within the proper Flask app context"""
    print("Starting database initialization...")
    with app.app_context():
        init_db()
    print("Database initialization complete!")

if __name__ == "__main__":
    main()

