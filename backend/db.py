import psycopg2

conn = psycopg2.connect(database="postgres",
                        user="postgres",
                        password="1046",
                        host="localhost",
                        port="5432")

cur = conn.cursor()

conn.commit()

cur.close()
conn.close()