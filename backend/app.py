from flask import Flask,request,json
from flask_cors import CORS
import requests
from pandas_datareader import data as pdr
from dotenv import load_dotenv
import os
import psycopg2
import psycopg2.extras

CREATE_USERS_TABLE = (
    """CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT ,user_name TEXT, password TEXT);"""
)

CREATE_SETTINGS_TABLE = """CREATE TABLE IF NOT EXISTS settings (user_id INTEGER, start_date TIMESTAMP,
                        end_date TIMESTAMP, ticker TEXT, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);"""

CREATE_WATCHLIST_TABLE = """CREATE TABLE IF NOT EXISTS watchlist (user_id INTEGER, ticker TEXT, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);"""

INSERT_USER_RETURN_ID = "INSERT INTO users (name, user_name, password) VALUES (%s, %s, %s) RETURNING id;"

INSERT_WATCHLIST = "INSERT INTO watchlist (user_id, ticker) VALUES (%s, %s);"

INSERT_SETTINGS = "INSERT INTO settings (user_id, start_date, end_date, ticker) VALUES (%s, %s, %s, %s)"

GLOBAL_USER = """SELECT * FROM users"""

GLOBAL_SETTING = """SELECT * FROM settings"""

GLOBAL_WATCHLIST ="""SELECT * FROM watchlist"""

SINGLE_USER = """SELECT * FROM users WHERE user_name = %s AND password = %s"""

SINGLE_SETTING = """SELECT * FROM settings WHERE user_id = %s"""

SINGLE_WATCHLIST = """SELECT * FROM watchlist WHERE user_id = %s"""

UPDATE_SETTING = """UPDATE settings SET start_date =%s, end_date=%s, ticker=%s  WHERE user_id = %s"""




app = Flask(__name__)
CORS(app)

load_dotenv()

base_url = os.getenv('URL')
api = os.getenv('API_KEY')
temp =os.getenv('temp_key')
db = os.getenv('DB_NAME')
user_name = os.getenv('USER')
passwaord = os.getenv('PASSWORD')
host = os.getenv('HOST')
port = os.getenv('PORT')


connection = psycopg2.connect(database=db,
                        user=user_name,
                        password=passwaord,
                        host=host,
                        port=port)

def int_func(tick):
    ticker = tick
    url = "%sfunction=TIME_SERIES_DAILY&symbol=%s&apikey=%s" %(base_url, ticker, temp)
    r = requests.get(url)
    data = r.json()
    last_date = list(data['Weekly Time Series'])[0]
    return data['Weekly Time Series'][last_date]

@app.post('/customTable')
def creat_ticker_table():
    req = request.get_json()
    ticker = req['ticker']
    url = "%sfunction=TIME_SERIES_DAILY&symbol=%s&interval=%s&outputsize=full&apikey=%s" %(base_url, ticker, api)
    start_date = req['start_date']
    end_date = req['end_date']
    r = requests.get(url)
    r = r.json()
    sliced = r['Time Series (Daily)'][start_date:end_date]
    with connection:
        with connection.cursor() as cursor:
            for key, value in sliced:
                CREATE_DYNAMIC_TABLE = f"CREATE TABLE IF NOT EXISTS {ticker} (date TIMESTAMP, open REAL, high REAL, low REAL, close REAL);"
                cursor.execute(CREATE_DYNAMIC_TABLE)
                INSERT_DATA = f"INSERT INTO {ticker} (date, open , high, low, close) VALUES(%s, %s, %s, %s, %s);"
                cursor.execute(INSERT_DATA, (key, value['1. open'], value['2. high'], value['3. low'], value['4. close']))
    return{"message":"table created"}


##########################################################################################################################
@app.route("/stockFullDaily", methods=['POST'])
def fullDaily():
    req = request.form
    ticker = req['symbol']
    interval = req['interval']
    url = "%sfunction=TIME_SERIES_DAILY&symbol=%s&interval=%s&outputsize=full&apikey=%s" %(base_url, ticker, interval, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.post("/stockDaily")
def daily():
    req = request.get_json()
    ticker = req['symbol']
    start_date = req['start_date']
    end_date = req['end_date']
    url = "%sfunction=TIME_SERIES_DAILY&symbol=%s&apikey=%s" %(base_url, ticker, temp)
    r = requests.get(url)
    data = r.json()
    sliced = r['Time Series (Daily)'][start_date:end_date]
    return sliced

@app.get("/gain")
def daily():
    url = "%sfunction=TOP_GAINERS_LOSERS&apikey=%s" %(base_url, temp)
    r = requests.get(url)
    data = r.json()
    top_gainers = data['top_gainers'][:5]
    res = []
    for gain in top_gainers:
        res += {"ticker":gain['ticker'], "per":gain['change_percentage']}
    return res

@app.post("/dailyQuote")
def quote():
    req = request.get_json()
    ticker  =req['symbol']
    url = "%sfunction=GLOBAL_QUOTE&symbol=%s&apikey=%s" %(base_url, ticker, temp)
    r = requests.get(url)
    data = r.json()
    return data['Global Quote']

@app.route("/stockWeekly", methods=['POST'])
def weekly():
    req = request.get_json()
    ticker = req['symbol']
    url = "%sfunction=TIME_SERIES_WEEKLY&symbol=%s&apikey=%s" %(base_url, ticker, temp)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/pinUp", methods=['POST'])
def pinUp():
    req = request.get_json()
    ticker = req['symbol']
    url = "%sfunction=TIME_SERIES_WEEKLY&symbol=%s&apikey=%s" %(base_url, ticker, api)
    r = requests.get(url)
    data = r.json()
    last_date = list(data['Weekly Time Series'])[0]
    return data['Weekly Time Series'][last_date]

@app.route("/stockMonthly", methods=['POST'])
def monthly():
    req = request.form
    ticker = req['symbol']
    interval = req['interval']
    url = "%sfunction=TIME_SERIES_MONTHLY&symbol=%s&interval=%s&apikey=%s" %(base_url, ticker, interval, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/search", methods=['POST'])
def search():
    req = request.form
    keyword = req['keyword']
    url = "%sfunction=SYMBOL_SEARCH&keywords=%s&apikey=%s" %(base_url, keyword, api)
    r = requests.get(url)
    data = r.json()
    return data

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

@app.route("/cryptoDaily", methods=['POST'])
def cryptoDail():
    req = request.get_json()
    cryptoc = req['crypto']
    to = req['currency']
    url = "%sfunction=DIGITAL_CURRENCY_DAILY&symbol=%s&market=%s&apikey=%s" %(base_url, cryptoc, to, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/cryptoWeekly", methods=['POST'])
def cryptoWee():
    req = request.get_json()
    cryptoc = req['crypto']
    to = req['currency']
    url = "%sfunction=DIGITAL_CURRENCY_WEEKLY&symbol=%s&market=%s&apikey=%s" %(base_url, cryptoc, to, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/cryptoMonthly", methods=['POST'])
def cryptoMon():
    req = request.get_json()
    cryptoc = req['crypto']
    to = req['currency']
    url = "%sfunction=DIGITAL_CURRENCY_MONTHLY&symbol=%s&market=%s&apikey=%s" %(base_url, cryptoc, to, api)
    r = requests.get(url)
    data = r.json()
    return data

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

@app.route("/forexDaily", methods=['POST'])
def forexFull():
    req = request.get_json()
    from_curr = req['from_curr']
    to_curr = req['to_curr']
    url = "%sfunction=FX_DAILY&from_symbol=%s&to_symbol=%s&outputsize=full&apikey=%s" %(base_url, from_curr, to_curr, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/forexDaily", methods=['POST'])
def forexDail():
    req = request.get_json()
    from_curr = req['from_curr']
    to_curr = req['to_curr']
    url = "%sfunction=FX_DAILY&from_symbol=%s&to_symbol=%s&apikey=%s" %(base_url, from_curr, to_curr, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/forexWeekly", methods=['POST'])
def forexWee():
    req = request.get_json()
    from_curr = req['from_curr']
    to_curr = req['to_curr']
    url = "%sfunction=FX_WEEKLY&from_symbol=%s&to_symbol=%s&apikey=%s" %(base_url, from_curr, to_curr, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/forexMonthly", methods=['POST'])
def forexMon():
    req = request.get_json()
    from_curr = req['from_curr']
    to_curr = req['to_curr']
    url = "%sfunction=FX_MONTHLY&from_symbol=%s&to_symbol=%s&apikey=%s" %(base_url, from_curr, to_curr, api)
    r = requests.get(url)
    data = r.json()
    return data

#########################################################################################################################


@app.post("/user")
def register():
    data = request.get_json()
    name = data["name"]
    user_name = data["user_name"]
    password = data["password"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(INSERT_USER_RETURN_ID, (name, user_name, password))
            id = cursor.fetchone()[0]
    return {"id": id, "message":f"User {name} created."}, 201

@app.get("/user")
def getUser():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GLOBAL_USER)
            user = cursor.fetchall()
    return {"user": user}, 200

@app.post("/login")
def userLogin():
    data = request.get_json()
    uname = data['user_name']
    password = data['password']
    with connection:
        with connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute(SINGLE_USER, (uname, password))
            user = cursor.fetchone()
    return {"user": {"user_id":user['id'], "name":user["name"], 'message':"success", 'accessToken': 'test_access_token' }}, 200


#################################################################################################################################


@app.post("/settings")
def postSetting():
    data = request.get_json()
    user_id = data["user_id"]
    start_date = data["start_date"]
    end_date = data["end_date"]
    ticker = data["ticker"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_SETTINGS_TABLE)
            cursor.execute(INSERT_SETTINGS, (user_id, start_date, end_date, ticker))
    return {"res": f"settings Created at for {user_id}"}, 201


@app.get("/settings")
def getSetting():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GLOBAL_SETTING)
            setting = cursor.fetchall()
    return {"setting": setting}, 200


@app.get("/settings/<int:user_id>")
def getSingleSetting(user_id):
    with connection:
        with connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute(SINGLE_SETTING, (user_id,))
            setting = cursor.fetchone()
    return {"setting": {"user_id":setting['user_id'], "start_date":setting['start_date'], "end_date":setting['end_date'], "ticker":setting['ticker']}}, 200


@app.put("/settings/<int:user_id>")
def putSetting(user_id):
    data = request.get_json()
    start_date = data['start_date']
    end_date = data['end_date']
    ticker = data['ticker']
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(UPDATE_SETTING, (start_date, end_date, ticker, user_id))
    return {"res": f"settings Updated at for {user_id}"}, 201


###################################################################################################################


@app.post("/watchlist")
def postWatchlist():
    data = request.get_json()
    user_id = data["user_id"]
    ticker = data["ticker"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_WATCHLIST_TABLE)
            cursor.execute(INSERT_WATCHLIST, (user_id, ticker))
    return {"res": f"Warchlist Created at for {user_id}"}, 201


@app.get("/watchlist")
def getWatchlist():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(GLOBAL_WATCHLIST)
            watchlist = cursor.fetchall()
    return {"watchlist": watchlist}, 200

@app.get("/watchlist/<int:user_id>")
def getSingleWatchlist(user_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(SINGLE_WATCHLIST, (user_id,))
            watchlist = cursor.fetchall()
    
    res = {}
    for k, v in watchlist:
        res += int_func(v)
    return {"watchlist": res}, 200


#################################################################################################################################


if __name__ == '__main__':
    app.run(debug=True)