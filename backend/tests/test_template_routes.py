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
    
    def test_get_user_exams(self):
        """Test retrieving all exams for the current user."""        
        # Create test templates and exams
        with app.app_context():
            # Create templates
            template1 = Template(topics='math,science', user_id=self.user.id)
            template2 = Template(topics='history,geography', user_id=self.user.id)
            db.session.add_all([template1, template2])
            db.session.commit()
            
            # Create exams
            exam1 = Exam(template_id=template1.id)
            exam2 = Exam(template_id=template1.id)  # Two exams for template1
            exam3 = Exam(template_id=template2.id)  # One exam for template2
            db.session.add_all([exam1, exam2, exam3])
            db.session.commit()
        
        # Test the endpoint
        response = self.app.get('/exams', headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 3)  # Should return all 3 exams
    
    def test_get_template_exams(self):
        """Test retrieving exams for a specific template."""        
        # Create test template and exams
        with app.app_context():
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            template_id = template.id
            
            # Create multiple exams for this template
            exam1 = Exam(template_id=template_id)
            exam2 = Exam(template_id=template_id)
            db.session.add_all([exam1, exam2])
            db.session.commit()
        
        # Test the endpoint
        response = self.app.get(f'/templates/{template_id}/exams', headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)  # Should have 2 exams
        for exam in data:
            self.assertEqual(exam['template_id'], template_id)
    
    def test_get_exam(self):
        """Test retrieving a specific exam with its questions."""        
        with app.app_context():
            # Create template
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            
            # Create an exam with questions
            exam = Exam(template_id=template.id)
            db.session.add(exam)
            db.session.commit()
            
            # Add questions to the exam
            question1 = Question(
                type='closed',
                topic='math',
                answer='42',
                options='["10", "42", "100", "1000"]',
                exam_id=exam.id
            )
            question2 = Question(
                type='open',
                topic='science',
                answer='Mitochondria is the powerhouse of the cell',
                exam_id=exam.id
            )
            db.session.add_all([question1, question2])
            db.session.commit()
            
            exam_id = exam.id
        
        # Test the endpoint
        response = self.app.get(f'/exams/{exam_id}', headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['id'], exam_id)
        self.assertEqual(len(data['questions']), 2)
        # Check that no answers are included in the response
        for question in data['questions']:
            self.assertNotIn('answer', question)
    
    def test_template_stats(self):
        """Test retrieving stats for a template."""        
        with app.app_context():
            # Create template
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            
            # Add stats for the template
            stat1 = Stat(
                topic='math',
                difficulty=7.0,
                trend='increasing',
                template_id=template.id
            )
            stat2 = Stat(
                topic='science',
                difficulty=3.0,
                trend='decreasing',
                template_id=template.id
            )
            db.session.add_all([stat1, stat2])
            db.session.commit()
            
            template_id = template.id
        
        # Test the endpoint
        response = self.app.get(f'/templates/{template_id}/stats', headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)
        
        # Check stats content
        topics = [stat['topic'] for stat in data]
        self.assertIn('math', topics)
        self.assertIn('science', topics)
        
        # Verify difficulty values
        for stat in data:
            if stat['topic'] == 'math':
                self.assertEqual(stat['difficulty'], 7.0)
                self.assertEqual(stat['trend'], 'increasing')
            elif stat['topic'] == 'science':
                self.assertEqual(stat['difficulty'], 3.0)
                self.assertEqual(stat['trend'], 'decreasing')
    
    def test_submit_answer(self):
        """Test submitting an answer for a question."""        
        # Store template ID rather than template object
        template_id = None
        exam_id = None
        question_id = None
        
        with app.app_context():
            # Create template
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            template_id = template.id
            
            # Create exam
            exam = Exam(template_id=template_id)
            db.session.add(exam)
            db.session.commit()
            
            # Create question
            question = Question(
                type='closed',
                topic='math',
                answer='42',
                options='["10", "42", "100", "1000"]',
                exam_id=exam.id
            )
            db.session.add(question)
            db.session.commit()
            
            exam_id = exam.id
            question_id = question.id
        
        # Test submitting correct answer
        response = self.app.post(
            f'/exams/{exam_id}/questions/{question_id}/answer',
            json={'answer': '42'},
            headers=self.headers
        )
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['is_correct'])
        self.assertEqual(data['correct_answer'], '42')
        
        # Verify stat was created with decreased difficulty (correct answer)
        with app.app_context():
            stat = Stat.query.filter_by(template_id=template_id, topic='math').first()
            self.assertIsNotNone(stat)
            self.assertLess(stat.difficulty, 5.0)  # Difficulty should decrease for correct answers
            self.assertEqual(stat.trend, 'decreasing')
        
        # Test submitting incorrect answer
        response = self.app.post(
            f'/exams/{exam_id}/questions/{question_id}/answer',
            json={'answer': '100'},
            headers=self.headers
        )
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertFalse(data['is_correct'])
        
        # Verify stat difficulty increased (incorrect answer)
        with app.app_context():
            stat = Stat.query.filter_by(template_id=template_id, topic='math').first()
            self.assertIsNotNone(stat)
            self.assertGreater(stat.difficulty, 4.5)  # Difficulty should increase for incorrect answers
            self.assertEqual(stat.trend, 'increasing')
    
    def test_request_clarification(self):
        """Test requesting clarification for a question."""        
        # Store template ID rather than template object
        template_id = None
        exam_id = None
        question_id = None
        
        with app.app_context():
            # Create template
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            template_id = template.id
            
            # Create exam
            exam = Exam(template_id=template_id)
            db.session.add(exam)
            db.session.commit()
            
            # Create question
            question = Question(
                type='closed',
                topic='science',
                answer='Mitochondria',
                options='["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"]',
                exam_id=exam.id
            )
            db.session.add(question)
            db.session.commit()
            
            exam_id = exam.id
            question_id = question.id
        
        # Test requesting clarification
        response = self.app.post(
            f'/exams/{exam_id}/questions/{question_id}/clarify',
            headers=self.headers
        )
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('clarification', data)
        
        # Verify stat was created with increased difficulty (needed clarification)
        with app.app_context():
            stat = Stat.query.filter_by(template_id=template_id, topic='science').first()
            self.assertIsNotNone(stat)
            self.assertGreater(stat.difficulty, 5.0)  # Difficulty should increase when clarification is needed
            self.assertEqual(stat.trend, 'increasing')
    
    def test_unauthorized_access_to_templates(self):
        """Test unauthorized access to template endpoints."""        
        # Try to access templates without authentication
        response = self.app.get('/templates')
        self.assertEqual(response.status_code, 401)
        
        # Try to create a template without authentication
        response = self.app.post('/templates', json={'topics': 'math,science'})
        self.assertEqual(response.status_code, 401)
        
        # Create template for testing
        with app.app_context():
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            template_id = template.id
        
        # Try to access specific template without authentication
        response = self.app.get(f'/templates/{template_id}')
        self.assertEqual(response.status_code, 401)
        
        # Try to update template without authentication
        response = self.app.put(f'/templates/{template_id}', json={'topics': 'new topics'})
        self.assertEqual(response.status_code, 401)
        
        # Try to delete template without authentication
        response = self.app.delete(f'/templates/{template_id}')
        self.assertEqual(response.status_code, 401)
    
    def test_unauthorized_access_to_exams(self):
        """Test unauthorized access to exam endpoints."""        
        # Create template and exam for testing
        with app.app_context():
            template = Template(topics='math,science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            
            exam = Exam(template_id=template.id)
            db.session.add(exam)
            db.session.commit()
            
            exam_id = exam.id
            template_id = template.id
        
        # Try to access exams without authentication
        response = self.app.get('/exams')
        self.assertEqual(response.status_code, 401)
        
        # Try to access specific exam without authentication
        response = self.app.get(f'/exams/{exam_id}')
        self.assertEqual(response.status_code, 401)
        
        # Try to create exam without authentication
        response = self.app.post(f'/templates/{template_id}/exams')
        self.assertEqual(response.status_code, 401)
        
        # Try to get template exams without authentication
        response = self.app.get(f'/templates/{template_id}/exams')
        self.assertEqual(response.status_code, 401)
    
    def test_template_not_found(self):
        """Test accessing a template that doesn't exist."""        
        non_existent_id = 9999  # Assuming this ID doesn't exist
        
        response = self.app.get(f'/templates/{non_existent_id}', headers=self.headers)
        self.assertEqual(response.status_code, 404)
        
        response = self.app.put(f'/templates/{non_existent_id}', 
                                json={'topics': 'new topics'}, 
                                headers=self.headers)
        self.assertEqual(response.status_code, 404)
        
        response = self.app.delete(f'/templates/{non_existent_id}', headers=self.headers)
        self.assertEqual(response.status_code, 404)
        
        response = self.app.post(f'/templates/{non_existent_id}/exams', headers=self.headers)
        self.assertEqual(response.status_code, 404)
        
        response = self.app.get(f'/templates/{non_existent_id}/stats', headers=self.headers)
        self.assertEqual(response.status_code, 404)
    
    def test_exam_not_found(self):
        """Test accessing an exam that doesn't exist."""        
        non_existent_id = 9999  # Assuming this ID doesn't exist
        
        response = self.app.get(f'/exams/{non_existent_id}', headers=self.headers)
        self.assertEqual(response.status_code, 404)
        
        # Also test questions with non-existent exam
        response = self.app.post(f'/exams/{non_existent_id}/questions/1/answer', 
                                json={'answer': '42'}, 
                                headers=self.headers)
        self.assertEqual(response.status_code, 404)
    
    def test_question_not_found(self):
        """Test accessing a question that doesn't exist."""        
        # Create template and exam
        with app.app_context():
            template = Template(topics='math', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            
            exam = Exam(template_id=template.id)
            db.session.add(exam)
            db.session.commit()
            
            exam_id = exam.id
        
        non_existent_question_id = 9999  # Assuming this ID doesn't exist
        
        # Test answering a non-existent question
        response = self.app.post(
            f'/exams/{exam_id}/questions/{non_existent_question_id}/answer',
            json={'answer': '42'},
            headers=self.headers
        )
        self.assertEqual(response.status_code, 404)
        
        # Test requesting clarification for a non-existent question
        response = self.app.post(
            f'/exams/{exam_id}/questions/{non_existent_question_id}/clarify',
            headers=self.headers
        )
        self.assertEqual(response.status_code, 404)
    
    def test_unauthorized_template_access(self):
        """Test accessing a template that belongs to another user."""        
        # Create another user
        with app.app_context():
            other_user = User(username='otheruser', password='password456', email='other@example.com')
            db.session.add(other_user)
            db.session.commit()
            
            # Create template for the other user
            template = Template(topics='math,science', user_id=other_user.id)
            db.session.add(template)
            db.session.commit()
            
            template_id = template.id
        
        # Try to access the other user's template
        response = self.app.get(f'/templates/{template_id}', headers=self.headers)
        self.assertEqual(response.status_code, 404)  # Should return 404 for security
        
        # Try to update the other user's template
        response = self.app.put(
            f'/templates/{template_id}',
            json={'topics': 'new topics'},
            headers=self.headers
        )
        self.assertEqual(response.status_code, 404)  # Should return 404 for security
        
        # Try to delete the other user's template
        response = self.app.delete(f'/templates/{template_id}', headers=self.headers)
        self.assertEqual(response.status_code, 404)  # Should return 404 for security
    
    def test_unauthorized_exam_access(self):
        """Test accessing an exam that belongs to another user's template."""        
        # Create another user with template and exam
        with app.app_context():
            other_user = User(username='otheruser', password='password456', email='other@example.com')
            db.session.add(other_user)
            db.session.commit()
            
            # Create template for the other user
            template = Template(topics='math,science', user_id=other_user.id)
            db.session.add(template)
            db.session.commit()
            
            # Create exam for that template
            exam = Exam(template_id=template.id)
            db.session.add(exam)
            db.session.commit()
            
            # Create question for that exam
            question = Question(
                type='closed',
                topic='math',
                answer='42',
                options='["10", "42", "100", "1000"]',
                exam_id=exam.id
            )
            db.session.add(question)
            db.session.commit()
            
            exam_id = exam.id
            question_id = question.id
        
        # Try to access the other user's exam
        response = self.app.get(f'/exams/{exam_id}', headers=self.headers)
        self.assertEqual(response.status_code, 403)
        
        # Try to submit answer to question on other user's exam
        response = self.app.post(
            f'/exams/{exam_id}/questions/{question_id}/answer',
            json={'answer': '42'},
            headers=self.headers
        )
        self.assertEqual(response.status_code, 403)
        
        # Try to request clarification for question on other user's exam
        response = self.app.post(
            f'/exams/{exam_id}/questions/{question_id}/clarify',
            headers=self.headers
        )
        self.assertEqual(response.status_code, 403)
    
    def test_missing_answer_submission(self):
        """Test submitting with missing answer field."""        
        with app.app_context():
            template = Template(topics='math', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            
            exam = Exam(template_id=template.id)
            db.session.add(exam)
            db.session.commit()
            
            question = Question(
                type='closed',
                topic='math',
                answer='42',
                options='["10", "42", "100", "1000"]',
                exam_id=exam.id
            )
            db.session.add(question)
            db.session.commit()
            
            exam_id = exam.id
            question_id = question.id
        
        # Submit with missing answer field
        response = self.app.post(
            f'/exams/{exam_id}/questions/{question_id}/answer',
            json={},  # Missing answer field
            headers=self.headers
        )
        self.assertEqual(response.status_code, 400)
        
        # Submit with null answer
        response = self.app.post(
            f'/exams/{exam_id}/questions/{question_id}/answer',
            json={'answer': None},
            headers=self.headers
        )
        self.assertEqual(response.status_code, 400)
    
    def test_case_insensitive_answers(self):
        """Test submitting answers with different case."""        
        with app.app_context():
            template = Template(topics='science', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            
            exam = Exam(template_id=template.id)
            db.session.add(exam)
            db.session.commit()
            
            question = Question(
                type='open',
                topic='science',
                answer='Mitochondria',
                exam_id=exam.id
            )
            db.session.add(question)
            db.session.commit()
            
            exam_id = exam.id
            question_id = question.id
        
        # Test with different case
        response = self.app.post(
            f'/exams/{exam_id}/questions/{question_id}/answer',
            json={'answer': 'mitochondria'},  # Lowercase
            headers=self.headers
        )
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['is_correct'])
        self.assertEqual(data['correct_answer'], 'Mitochondria')
    
    def test_multiple_topics_stat_updates(self):
        """Test updating stats for multiple topics."""        
        with app.app_context():
            template = Template(topics='math,science,history', user_id=self.user.id)
            db.session.add(template)
            db.session.commit()
            
            exam = Exam(template_id=template.id)
            db.session.add(exam)
            db.session.commit()
            
            # Create questions for different topics
            question_math = Question(
                type='closed',
                topic='math',
                answer='42',
                options='["10", "42", "100", "1000"]',
                exam_id=exam.id
            )
            question_science = Question(
                type='closed',
                topic='science',
                answer='Hydrogen',
                options='["Hydrogen", "Oxygen", "Carbon", "Nitrogen"]',
                exam_id=exam.id
            )
            question_history = Question(
                type='closed',
                topic='history',
                answer='1776',
                options='["1776", "1789", "1812", "1492"]',
                exam_id=exam.id
            )
            db.session.add_all([question_math, question_science, question_history])
            db.session.commit()
            
            exam_id = exam.id
            math_id = question_math.id
            science_id = question_science.id
            history_id = question_history.id
            template_id = template.id
        
        # Submit correct answer for math
        self.app.post(
            f'/exams/{exam_id}/questions/{math_id}/answer',
            json={'answer': '42'},
            headers=self.headers
        )
        
        # Submit incorrect answer for science
        self.app.post(
            f'/exams/{exam_id}/questions/{science_id}/answer',
            json={'answer': 'Oxygen'},
            headers=self.headers
        )
        
        # Request clarification for history
        self.app.post(
            f'/exams/{exam_id}/questions/{history_id}/clarify',
            headers=self.headers
        )
        
        # Get stats and verify they were updated correctly
        response = self.app.get(f'/templates/{template_id}/stats', headers=self.headers)
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 3)  # Should have stats for all three topics
        
        # Verify each topic has the correct difficulty trend
        for stat in data:
            if stat['topic'] == 'math':
                self.assertLess(stat['difficulty'], 5.0)  # Decreased for correct answer
                self.assertEqual(stat['trend'], 'decreasing')
            elif stat['topic'] == 'science':
                self.assertGreater(stat['difficulty'], 5.0)  # Increased for incorrect answer
                self.assertEqual(stat['trend'], 'increasing')
            elif stat['topic'] == 'history':
                self.assertGreater(stat['difficulty'], 5.0)  # Increased for clarification request
                self.assertEqual(stat['trend'], 'increasing')

if __name__ == '__main__':
    unittest.main()