import os
import sys
import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app, db
from models import User, Template, Exam, Question, Stat

class ModelTestCase(unittest.TestCase):
    """Test cases for database models."""
    
    def setUp(self):
        """Set up test database."""
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
    
    def test_user_creation(self):
        """Test User model creation."""
        with app.app_context():
            user = User(username='testuser', password='password', email='test@example.com')
            db.session.add(user)
            db.session.commit()
            
            saved_user = User.query.filter_by(username='testuser').first()
            self.assertIsNotNone(saved_user)
            self.assertEqual(saved_user.username, 'testuser')
            self.assertEqual(saved_user.email, 'test@example.com')
    
    def test_template_creation(self):
        """Test Template model creation and relationship with User."""
        with app.app_context():
            # Create a user
            user = User(username='testuser', password='password', email='test@example.com')
            db.session.add(user)
            db.session.commit()
            
            # Create a template associated with the user
            template = Template(topics='math,science', user_id=user.id)
            db.session.add(template)
            db.session.commit()
            
            # Retrieve the template and verify relationship
            saved_template = Template.query.first()
            self.assertIsNotNone(saved_template)
            self.assertEqual(saved_template.topics, 'math,science')
            self.assertEqual(saved_template.creator.username, 'testuser')
            
            # Verify user's templates relationship
            self.assertEqual(len(user.templates), 1)
            self.assertEqual(user.templates[0].topics, 'math,science')
    
    def test_stats_creation(self):
        """Test Stat model creation and relationship with Template."""
        with app.app_context():
            # Create a user and template
            user = User(username='testuser', password='password', email='test@example.com')
            db.session.add(user)
            db.session.commit()
            
            template = Template(topics='math,science', user_id=user.id)
            db.session.add(template)
            db.session.commit()
            
            # Create stats associated with the template
            stat1 = Stat(topic='math', difficulty=7.5, trend='up', template_id=template.id)
            stat2 = Stat(topic='science', difficulty=6.0, trend='down', template_id=template.id)
            db.session.add_all([stat1, stat2])
            db.session.commit()
            
            # Verify stats were created
            template_stats = Stat.query.filter_by(template_id=template.id).all()
            self.assertEqual(len(template_stats), 2)
            
            # Verify template relationship
            self.assertEqual(len(template.stats), 2)
            topics = sorted([stat.topic for stat in template.stats])
            self.assertEqual(topics, ['math', 'science'])
    
    def test_exam_and_questions(self):
        """Test Exam and Question models and their relationships."""
        with app.app_context():
            # Create a user and template
            user = User(username='testuser', password='password', email='test@example.com')
            db.session.add(user)
            db.session.commit()
            
            template = Template(topics='math,science', user_id=user.id)
            db.session.add(template)
            db.session.commit()
            
            # Create an exam
            exam = Exam(template_id=template.id)
            db.session.add(exam)
            db.session.commit()
            
            # Create questions for the exam
            q1 = Question(
                type='open',
                answer='The mitochondria is the powerhouse of the cell',
                topic='biology',
                exam_id=exam.id
            )
            q2 = Question(
                type='closed',
                answer='42',
                topic='math',
                options='{"options": ["10", "42", "100", "1000"]}',
                exam_id=exam.id
            )
            db.session.add_all([q1, q2])
            db.session.commit()
            
            # Verify relationships
            self.assertEqual(len(exam.questions), 2)
            self.assertEqual(exam.template.topics, 'math,science')
            self.assertEqual(exam.template.creator.username, 'testuser')
            
            # Check question types
            open_question = Question.query.filter_by(type='open').first()
            closed_question = Question.query.filter_by(type='closed').first()
            
            self.assertIsNotNone(open_question)
            self.assertIsNotNone(closed_question)
            self.assertIsNone(open_question.options)
            self.assertIsNotNone(closed_question.options)

if __name__ == '__main__':
    unittest.main()