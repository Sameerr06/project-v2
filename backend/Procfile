web: gunicorn quiz_backend.wsgi --log-file -
worker: python manage.py process_tasks
release: python manage.py migrate