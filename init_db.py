import sqlite3
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FOLDER = os.path.join(BASE_DIR, "App Database")
DB_FILE = os.path.join(DB_FOLDER, "smart_spend.db")
SCHEMA_FILE = os.path.join(DB_FOLDER, "schema.sql")

def init_db():
    print(f"Initializing database at {DB_FILE}...")
    
    # Ensure directory exists
    if not os.path.exists(DB_FOLDER):
        os.makedirs(DB_FOLDER)
        print(f"Created directory: {DB_FOLDER}")

    # Read schema
    try:
        with open(SCHEMA_FILE, 'r') as f:
            schema = f.read()
    except FileNotFoundError:
        print(f"Error: Schema file not found at {SCHEMA_FILE}")
        return

    # Connect and execute
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.executescript(schema)
        conn.commit()
        conn.close()
        print("Database initialized successfully!")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    init_db()
