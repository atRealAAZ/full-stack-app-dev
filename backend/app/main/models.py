from app import db

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    from_account = db.Column(db.String(18))
    to_account = db.Column(db.String(18))
    amount = db.Column(db.Integer)
    currency = db.Column(db.String(3))
    date = db.Column(db.String(10))

    def __repr__(self):
        return '<Transaction {}>'.format(self.id)