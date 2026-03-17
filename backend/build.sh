#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

if [[ $CREATE_SUPERUSER ]];
then
  python manage.py createsuperuser \
      --no-input \
      --username "$DJANGO_SUPERUSER_USERNAME" \
      --email "$DJANGO_SUPERUSER_EMAIL"
fi

python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
username = 'admin';
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, 'admin@example.com', 'admin123')
    print('Superuser created')
"