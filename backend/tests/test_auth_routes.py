import os
import sys
import unittest
import json
from flask_jwt_extended import create_access_token

# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app, db
from models import User

class AuthRoutesTestCase(unittest.TestCase):
    """Test cases for authentication routes."""
    
    def setUp(self):
        """Set up test database and client."""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        with app.app_context():
            db.create_all()
    
    def tearDown(self):
        """Tear down test database."""
        with app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_register_route(self):
        """Test user registration endpoint."""
        response = self.app.post('/register', 
                                json={
                                    'username': 'testuser',
                                    'password': 'password123',
                                    'email': 'test@example.com'
                                })
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data['message'], 'User registered successfully')
        
        # Verify user was created in the database
        with app.app_context():
            user = User.query.filter_by(username='testuser').first()
            self.assertIsNotNone(user)
            self.assertEqual(user.email, 'test@example.com')
    
    def test_register_duplicate_username(self):
        """Test registration with duplicate username."""
        # First registration
        self.app.post('/register', 
                    json={
                        'username': 'testuser',
                        'password': 'password123',
                        'email': 'test@example.com'
                    })
        
        # Second registration with same username
        response = self.app.post('/register', 
                                json={
                                    'username': 'testuser',
                                    'password': 'password123',
                                    'email': 'another@example.com'
                                })
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 409)
        self.assertEqual(data['message'], 'Username already exists')
    
    def test_register_duplicate_email(self):
        """Test registration with duplicate email."""
        # First registration
        self.app.post('/register', 
                    json={
                        'username': 'testuser',
                        'password': 'password123',
                        'email': 'test@example.com'
                    })
        
        # Second registration with same email
        response = self.app.post('/register', 
                                json={
                                    'username': 'anotheruser',
                                    'password': 'password123',
                                    'email': 'test@example.com'
                                })
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 409)
        self.assertEqual(data['message'], 'Email already exists')
    
    def test_login_route(self):
        """Test user login endpoint."""
        # Register user first
        self.app.post('/register', 
                    json={
                        'username': 'testuser',
                        'password': 'password123',
                        'email': 'test@example.com'
                    })
        
        # Test login
        response = self.app.post('/login', 
                                json={
                                    'username': 'testuser',
                                    'password': 'password123'
                                })
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', data)
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        # Register user first
        self.app.post('/register', 
                    json={
                        'username': 'testuser',
                        'password': 'password123',
                        'email': 'test@example.com'
                    })
        
        # Test login with wrong password
        response = self.app.post('/login', 
                                json={
                                    'username': 'testuser',
                                    'password': 'wrongpassword'
                                })
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data['message'], 'Invalid credentials')
    
    def test_profile_route(self):
        """Test profile endpoint with JWT auth."""
        with app.app_context():
            # Create a user
            from werkzeug.security import generate_password_hash
            user = User(
                username='testuser',
                password=generate_password_hash('password123'),
                email='test@example.com'
            )
            db.session.add(user)
            db.session.commit()
            
            # Create access token
            access_token = create_access_token(identity=user.username)
        
        # Test profile endpoint with token
        response = self.app.get('/profile',
                               headers={'Authorization': f'Bearer {access_token}'})
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['Username'], 'testuser')
        self.assertEqual(data['Email'], 'test@example.com')

if __name__ == '__main__':
    unittest.main()