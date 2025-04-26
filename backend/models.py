from main import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    templates = db.relationship('Template', backref='creator', lazy=True)

class Stat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.Float, nullable=False)  # Could be a score from 0-10
    trend = db.Column(db.String(10), nullable=False)  # "up" or "down"
    template_id = db.Column(db.Integer, db.ForeignKey('template.id'), nullable=False)

class Template(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(80))
    topics = db.Column(db.String(200), nullable=False)  # Could be JSON or comma-separated
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    stats = db.relationship('Stat', backref='template', lazy=True)
    exams = db.relationship('Exam', backref='template', lazy=True)

class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.Text, db.ForeignKey('template.id'), nullable=False)
    questions = db.Column(db.Text, nullable=False)  # JSON string for questions

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(10), nullable=False)  # "open" or "closed"
    answer = db.Column(db.Text, nullable=False)
    points = db.Column(db.Integer, nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    options = db.Column(db.Text, nullable=False)  # JSON string for closed questions
    solution = db.Column(db.Text, nullable=False)  # JSON string for closed questions
    exam_id = db.Column(db.Integer, db.ForeignKey('exam.id'), nullable=False)