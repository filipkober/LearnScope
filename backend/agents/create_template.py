import sqlite3
import asyncio
import json
from upload_text_api import upload_text_api
from flask import g
import flask_login

def create_template(subject, topics, user_id):
    conn = sqlite3.connect('backend/instance/users.db')
    cursor = conn.cursor()

    cursor.execute('''
    INSERT INTO template (id, subject, topics, user_id)
    VALUES (?, ?, ?, ?)
    ''', (None, subject, topics, user_id))

    print("Values inserted into the 'template' table successfully.")

    conn.commit()
    conn.close()

slownik = asyncio.run(upload_text_api("2+2,2*2,2x+3-0=2"))

slownik = json.loads(slownik)

for i in slownik["ListaZagadnien"]:
    create_template(i["przedmiot"], i["description"], int(1))