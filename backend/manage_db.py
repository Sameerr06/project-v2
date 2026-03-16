import os
import dj_database_url
from django.core.management import call_command
from datetime import datetime
import sqlite3

def backup_database():
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f'db_backup_{timestamp}.json'
    change_log = f'db_changes_{timestamp}.log'
    
    # Create JSON backup
    call_command('dumpdata', output=backup_file)
    
    # Track changes by comparing table row counts
    db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
    
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_schema WHERE type='table'")
        tables = cursor.fetchall()
        
        with open(change_log, 'w') as f:
            for table in tables:
                table_name = table[0]
                if table_name.startswith('sqlite_'):
                    continue
                    
                # Get row count
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                row_count = cursor.fetchone()[0]
                
                f.write(f"Table: {table_name}, Rows: {row_count}\n")
    
    print(f"Database backup saved to {backup_file}")
    print(f"Change log saved to {change_log}")

def schedule_backups():
    import schedule
    import time
    
    # Schedule daily backups at 2 AM
    schedule.every().day.at("02:00").do(backup_database)
    
    while True:
        schedule.run_pending()
        time.sleep(1)

def restore_database():
    backup_file = 'db_backup.sql'
    if os.path.exists(backup_file):
        call_command('loaddata', backup_file)
        print(f"Database restored from {backup_file}")
    else:
        print("Backup file not found")