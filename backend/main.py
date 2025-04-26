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

# Import blueprints after initializing extensions to avoid circular imports
# First, import the files directly to avoid conflicts with other packages
import importlib.util
import sys

# Import login blueprint
login_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'login.py')
spec = importlib.util.spec_from_file_location("login_module", login_path)
login_module = importlib.util.module_from_spec(spec)
sys.modules["login_module"] = login_module
spec.loader.exec_module(login_module)

# Import template blueprint
template_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'template.py')
spec = importlib.util.spec_from_file_location("template_module", template_path)
template_module = importlib.util.module_from_spec(spec)
sys.modules["template_module"] = template_module
spec.loader.exec_module(template_module)

# Get blueprints from modules
auth_bp = login_module.auth_bp
template_bp = template_module.template_bp

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(template_bp)

init_db()

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(debug=True)