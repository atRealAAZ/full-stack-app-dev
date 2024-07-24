from app import app, db
from app.utils import *
from app.authentication.models import User
from app.main.routes import get_overview
from config import Config

from flask import request

def get_idx():
    return len(
        User
        .query
        .all()
    )

def add_user_to_db(username, email, password):
    user_idx = get_idx()
    new_user = User(
        username = username,
        email = email
    )
    new_user.set_password(password)
    new_user.create_new_account(
        user_idx,
        signup_bonus = Config.SIGNUP_BONUS
    )
    db.session.add(new_user)
    db.session.commit()
    return new_user

@app.route('/register', methods = ['GET', 'POST'])
def register():
    message = request.get_json()['loginDetails']
    email, username, password = message.values()
    email_exists = db_query(User, 'email', email)[0]
    user_exists = db_query(User, 'username', username)[0]
    if email_exists:
        return gen_result_dict(
            success = False,
            message = "Email address already taken."
        )
    if user_exists:
        return gen_result_dict(
            success = False,
            message = "Username already exists, choose another username."
        )
    else:
        new_user = add_user_to_db(
            username, email, password
        )
        return gen_result_dict(
            success = True,
            message = "Account created successfully! Welcome {}".format(username),
            result = get_overview(new_user)
        )
    
@app.route('/login', methods = ['GET', 'POST'])
def login():
    message = request.get_json()['loginDetails']
    _, username, password = message.values()
    exists, user = db_query(User, 'username', username)
    if exists:
        if user.check_password(password):
            result = get_overview(user)
            return gen_result_dict(
                success = True,
                message = "Login successful!",
                result = result
            )
        else:
            return gen_result_dict(
                success = False,
                message = "Wrong info, fool."
            )
    else:
        return gen_result_dict(
            success = False,
            message = "User not found."
        )
