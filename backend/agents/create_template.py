import sqlite3
import asyncio
import json
from upload_text_api import upload_text_api
from flask import g
import flask_login
from generate_exercise import generate_exercise

import sqlite3
import asyncio
import json
from upload_text_api import upload_text_api
from flask import g
import flask_login
from generate_exercise import generate_exercise

def create_template(subject, topics, user_id):
    conn = sqlite3.connect('instance/users.db')
    cursor = conn.cursor()

    # count of exams in the database
    countE = cursor.execute('SELECT COUNT(*) FROM exam').fetchone()[0]

    # count of templates in the database
    countT = cursor.execute('SELECT COUNT(*) FROM template').fetchone()[0]
    
    # pobieranie pytań
    ex = asyncio.run(generate_exercise(topics, subject))
    ex = json.loads(ex)
    questions = ex["questions"]

    # dodawanie pytań
    for idx, question in enumerate(questions):
        cursor.execute('''
            INSERT INTO question (id, type, answer, points, topic, options, solution, exam_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            idx + countE * 100,  # Unikalne id dla pytania (przykładowa strategia)
            question["type"],
            question["answer"],
            question["points"],
            question["topic"],
            json.dumps(question["options"]),
            json.dumps(question["solution"]),
            countE  # exam_id przypisany do egzaminu
        ))
        print("QUESTION dodany")

    # zbieranie id pytań do egzaminu
    cursor.execute('SELECT id FROM question WHERE exam_id = ?', (countE,))
    question_ids = cursor.fetchall()
    question_ids = [str(q[0]) for q in question_ids]
    questions_str = ",".join(question_ids)

    # dodanie egzaminu
    cursor.execute('''
        INSERT INTO exam (id, subject, questions)
        VALUES (?, ?, ?)
    ''', (countE, ex["template"], questions_str))
    print("EXAM dodany")

    # dodanie szablonu
    cursor.execute('''
        INSERT INTO template (id, subject, topics, user_id)
        VALUES (?, ?, ?, ?)
    ''', (countT, subject, topics, user_id))
    print("TEMPLATE dodany")

    conn.commit()
    conn.close()

# slownik = asyncio.run(upload_text_api("2+2,2*2,2x+3-0=2"))

# slownik = json.loads(slownik)

# for i in slownik["ListaZagadnien"]:
#     create_template(i["przedmiot"], i["description"], int(1))

