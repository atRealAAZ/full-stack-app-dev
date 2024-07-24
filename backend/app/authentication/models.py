from app import db

from werkzeug.security import generate_password_hash, check_password_hash

def elongate_account_number(idx, length = 10):
    len_idx = len(str(idx))
    len_remain = length - len_idx
    elongated = '0' * len_remain + str(idx)
    return elongated

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(32), index = True, unique = True)
    email = db.Column(db.String(64), index = True, unique = True)
    password = db.Column(db.String(64))
    account_number = db.Column(db.String(18))
    balance = db.Column(db.Integer)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def create_new_account(self, idx, signup_bonus):
        if signup_bonus['active']:
            self.balance = signup_bonus['amount']
        else:
            self.balance

        suffix = elongate_account_number(idx)
        self.account_number = 'NL01AAZB' + suffix

    def __repr__(self):
        return '<User {}>'.format(self.username)