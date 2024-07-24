from app import app, db
from app.main.models import Transaction

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'Transaction': Transaction
    }