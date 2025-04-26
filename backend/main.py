from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import os
import pathlib

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure app
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_secret_key')

# Make sure the instance directory exists
os.makedirs(app.instance_path, exist_ok=True)

# Configure database with absolute path
db_path = os.path.join(app.instance_path, 'users.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt_secret_key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

def init_db():
    """Initialize the database."""
    # Ensure the application instance folder exists
    pathlib.Path(app.instance_path).mkdir(parents=True, exist_ok=True)
    
    # Import models to ensure they're registered with SQLAlchemy
    import models
    
    with app.app_context():
        db.create_all()
        print(f"Database tables created successfully at {app.config['SQLALCHEMY_DATABASE_URI']}")

from login import auth_bp
from template import template_bp

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(template_bp)

init_db()

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(debug=True)