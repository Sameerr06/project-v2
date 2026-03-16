import os
import psycopg2
from urllib.parse import urlparse

def get_db_connection():
    try:
        result = urlparse(os.environ.get('DATABASE_URL'))
        conn = psycopg2.connect(
            dbname=result.path[1:],
            user=result.username,
            password=result.password,
            host=result.hostname,
            port=result.port
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

# Example usage
connection = get_db_connection()
if connection:
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM students")
    records = cursor.fetchall()
    for row in records:
        print(row)
    cursor.close()
    connection.close()