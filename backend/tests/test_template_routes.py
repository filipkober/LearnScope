import os
import sys
import unittest
import json
from flask_jwt_extended import create_access_token

# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app, db
from models import User, Template, Stat, Exam, Question

class TemplateRoutesTestCase(unittest.TestCase):
    """Test cases for template-related routes."""
    
    def setUp(self):
        """Set up test database and client."""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        with app.app_context():
            db.create_all()
            
            # Create test user
            self.user = User(username='testuser', password='password123', email='test@example.com')
            db.session.add(self.user)
            db.session.commit()
            
            # Create access token for authentication
            self.access_token = create_access_token(identity=self.user.username)
            self.headers = {'Authorization': f'Bearer {self.access_token}'}
    
    def tearDown(self):
        """Tear down test database."""
        with app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_create_template(self):
        """Test template creation endpoint."""
        # This test assumes there's a /templates POST endpoint
        response = self.app.post('/templates',
                                json={'topics': 'math,science,history'},
                                headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', data)
        self.assertEqual(data['topics'], 'math,science,history')
        
        # Verify template was created in the database
        with app.app_context():
            template = Template.query.get(data['id'])
            self.assertIsNotNone(template)
            self.assertEqual(template.topics, 'math,science,history')
            self.assertEqual(template.user_id, self.user.id)
    
    def test_get_templates(self):
        """Test getting all templates for a user."""
        # Create test templates
        with app.app_context():
            template1 = Template(topics='math,science', user_id=self.user.id)
            template2 = Template(topics='history,geography', user_id=self.user.id)
            db.session.add_all([template1, template2])
            db.session.commit()
        
        # This test assumes there's a /templates GET endpoint
        response = self.app.get('/templates', headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['topics'], 'math,science')
        self.assertEqual(data[1]['topics'], 'history,geography')
    
    def test_get_template(self):
        """Test getting a specific template."""
        # Create test template
        with app.app_context():
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            template_id = template.id
        
        # This test assumes there's a /templates/<id> GET endpoint
        response = self.app.get(f'/templates/{template_id}', headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['id'], template_id)
        self.assertEqual(data['topics'], 'math,science')
    
    def test_update_template(self):
        """Test updating a template."""
        # Create test template
        with app.app_context():
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            template_id = template.id
        
        # This test assumes there's a /templates/<id> PUT endpoint
        response = self.app.put(f'/templates/{template_id}',
                              json={'topics': 'math,physics,chemistry'},
                              headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['id'], template_id)
        self.assertEqual(data['topics'], 'math,physics,chemistry')
        
        # Verify changes in the database
        with app.app_context():
            updated_template = Template.query.get(template_id)
            self.assertEqual(updated_template.topics, 'math,physics,chemistry')
    
    def test_delete_template(self):
        """Test deleting a template."""
        # Create test template
        with app.app_context():
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            template_id = template.id
        
        # This test assumes there's a /templates/<id> DELETE endpoint
        response = self.app.delete(f'/templates/{template_id}', headers=self.headers)
        
        self.assertEqual(response.status_code, 200)
        
        # Verify template was deleted
        with app.app_context():
            template = Template.query.get(template_id)
            self.assertIsNone(template)
    
    def test_create_exam_from_template(self):
        """Test creating an exam from a template."""
        # Create test template
        with app.app_context():
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            template_id = template.id
        
        # This test assumes there's a /templates/<id>/exams POST endpoint
        response = self.app.post(f'/templates/{template_id}/exams', headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', data)
        self.assertEqual(data['template_id'], template_id)
        
        # Verify exam was created
        with app.app_context():
            exam = Exam.query.get(data['id'])
            self.assertIsNotNone(exam)
            self.assertEqual(exam.template_id, template_id)

if __name__ == '__main__':
    unittest.main()