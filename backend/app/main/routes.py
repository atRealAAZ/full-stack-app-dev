from app import app
from app.utils import *
from app.main.models import *
from app.authentication.models import *
from config import Config

from datetime import datetime
from flask import request

def add_tx_to_db(
    username,
    transactions_details
):
    to_account, amount, currency = transactions_details.values()
    amount = int(amount)
    user_sender = db_query(
        User, 'username', username
    )[1]
    user_receiver = db_query(
        User, 'account_number', to_account
    )[1]
    today = datetime.strftime(datetime.today(), "%d-%m-%Y")
    tx = Transaction(
        from_account = user_sender.account_number,
        to_account = to_account,
        amount = amount,
        currency = currency,
        date = today
    )
    user_sender.balance -= amount
    user_receiver.balance += amount
    db.session.add_all(
        [
            tx,
            user_sender,
            user_receiver
        ]
    )
    db.session.commit()

def validate_transaction(username, transactions_details):
    to_account, amount, currency = transactions_details.values()
    try:
        amount = int(amount)
    except:
        return False, "Invalid amount."
    user_sender = db_query(
        User, 'username', username
    )[1]
    user_receiver = db_query(
        User, 'account_number', to_account
    )[1]
    if user_receiver == None:
        return False, "Account does not exist!"
    elif to_account == user_sender.account_number:
        return False, "You cannot send money to yourself, fool."
    if amount == '' or int(amount) == 0:
        return False, "Amount can't be 0."
    elif amount > user_sender.balance:
        return False, "Nice try, but you don't have enough money!"
    elif currency != "EUR" and currency != "USD":
        return False, "Transaction in currency {} not supported.".format(currency)
    else:
        return True, "Transaction sent!"
    
def get_overview(user):
    tx_exists, txs = fetch_transactions(user.account_number)
    return gen_result_dict(
        account_details = gen_result_dict(
            username = user.username,
            accountNumber = user.account_number,
            balance = user.balance
        ),
        tx_table = gen_result_dict(
            tx_exists = tx_exists,
            txs = txs,
            page = 0
        )
    )

def fetch_transactions(account_number):
    tx_query = Transaction.query.filter_by(
        to_account = account_number
    ).union(
        Transaction.query.filter_by(
            from_account = account_number
        )
    ).order_by(
        Transaction.id.desc()
    )
    txs_raw = tx_query.all()
    if len(txs_raw) == 0:
        return False, []
    else:
        paginated_txs = get_paginated_object(tx_query)
        return True, paginated_txs

def gen_pagination_dict(
    has_prev, 
    txs_on_page,
    has_next
):
    return {
        'has_prev': has_prev,
        'txs_on_page': txs_on_page,
        'has_next': has_next
    }

def get_paginated_object(sqlalchemy_obj):
    paginates = []
    num_pages = sqlalchemy_obj.paginate(
        page = 1,
        per_page = Config.TX_PER_PAGE
    ).pages
    for page_num in range(1, num_pages + 1):
        page = sqlalchemy_obj.paginate(
            page = page_num,
            per_page = Config.TX_PER_PAGE
        )
        paginate = gen_pagination_dict(
            page.has_prev,
            [get_dict_from_object(tx) for tx in page.items],
            page.has_next
        )
        paginates.append(paginate)
    return paginates

@app.route('/send_transaction', methods = ['GET', 'POST'])
def send_transaction():
    message = request.get_json()
    username, transaction_details = message.values()
    validated, validation_msg = validate_transaction(
        username, transaction_details
    )
    if validated:
        add_tx_to_db(
            username, transaction_details
        )
    result = gen_result_dict(
        result = validated,
        message = validation_msg
    )
    return result

@app.route('/get_overview_route', methods = ['GET', 'POST'])
def get_overview_route():
    message = request.get_json()['loginDetails']
    _, username, _ = message.values()
    user = db_query(User, 'username', username)[1]
    result = get_overview(user)
    return gen_result_dict(
        success = True,
        result = result
    )