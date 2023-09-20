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

CREATE_WATCHLIST_TABLE = """CREATE TABLE IF NOT EXISTS watchlist (user_id INTEGER, ticker TEXT, FOREGIN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);"""

# CREATE_HIST_DATA_TABLE = """CREATE TABLE IF NOT EXISTS history (id SERIAL PRIMARY KEY, ticker TEXT, open REAL, close REAL, )"""

INSERT_USER_RETURN_ID = "INSERT INTO users (name, user_name, password) VALUES (%s, %s, %s) RETURNING id;"

INSERT_WATCHLIST = "INSERT INTO watchlist (user_id, ticker) VALUES (%s, %s);"

INSERT_SETTINGS = "INSERT INTO settings (user_id, start_date, end_date, ticker) VALUES (%s, %s, %s, %s)"

GLOBAL_USER = """SELECT * FROM users"""

GLOBAL_SETTING = """SELECT * FROM settings"""

GLOBAL_WATCHLIST ="""SELECT * FROM watchlist"""

SINGLE_USER = """SELECT * FROM users WHERE user_name = (%s) AND password = (%s)"""

SINGLE_SETTING = """SELECT * FROM setting WHERE user_id = (%s)"""

SINGLE_WATCHLIST = """SELECT * FROM watchlist WHERE user_id = (%s)"""




app = Flask(__name__)
CORS(app)

load_dotenv()

base_url = os.getenv('URL')
api = os.getenv('API_KEY')
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

# @app.route("/<ticker>", methods=['GET'])
# def hello_world(ticker):
#     data = ysf.Ticker(ticker)
#     return data.info

# @app.route("/getCurr", methods=['GET'])
# def curr_price():
#     symbol = request.args.get('symbol', default="AAPL")
#     period = request.args.get('period', default='1y')
#     interval = request.args.get('interval', default='1mo')
#     quote = ysf.Ticker(symbol)
#     hist = quote.history(period=period, interval=interval)
#     data = hist.to_json()
#     return data

##########################################################################################################################

@app.route("/getDaily", methods=['GET'])
def daily():
    req = request.form
    ticker = req['symbol']
    interval = req['interval']
    url = "%sfunction=TIME_SERIES_DAILY&symbol=%s.BSE&interval=%s&apikey=%s" %(base_url, ticker, interval, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/getWeekly", methods=['GET'])
def weekly():
    req = request.form
    ticker = req['symbol']
    interval = req['interval']
    url = "%sfunction=TIME_SERIES_WEEKLY&symbol=%s.BSE&interval=%s&apikey=%s" %(base_url, ticker, interval, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/getMonthly", methods=['GET'])
def monthly():
    req = request.form
    ticker = req['symbol']
    interval = req['interval']
    url = "%sfunction=TIME_SERIES_MONTHLY&symbol=%s.BSE&interval=%s&apikey=%s" %(base_url, ticker, interval, api)
    r = requests.get(url)
    data = r.json()
    return data

@app.route("/search", methods=['GET'])
def search():
    req = request.form
    keyword = req['keyword']
    url = "%sfunction=SYMBOL_SEARCH&keywords=%s&apikey=%s" %(base_url, keyword, api)
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

@app.get("/login")
def userLogin():
    data = request.get_json()
    uname = data['user_name']
    password = data['password']
    with connection:
        with connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute(SINGLE_USER, (uname, password))
            user = cursor.fetchone()
    return {"user": {"user_id":user['id'], "name":user["name"] ,"user_name":user['user_name'], "password":user['password']}}, 200


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
    return {f"settings Created at for {user_id}"}, 201


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
        with connection.cursor() as cursor:
            cursor.execute(SINGLE_SETTING, (user_id,))
            setting = cursor.fetchone()[0]
    return {"setting": setting}, 200


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
    return {f"Warchlist Created at for {user_id}"}, 201


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
            watchlist = cursor.fetchone()[0]
    return {"watchlist": watchlist}, 200


#################################################################################################################################


if __name__ == '__main__':
    app.run(debug=True)