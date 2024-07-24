#!/bin/bash
source venv/bin/activate
flask db init
flask db migrate -m "init db"
flask db upgrade
exec gunicorn -b :$PORT --access-logfile - --error-logfile - backend:app