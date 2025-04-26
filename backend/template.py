from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

template_bp = Blueprint('template', __name__)

# Import models after creating blueprint to avoid circular imports
from main import db
from models import User, Template, Exam, Question, Stat

@template_bp.route('/templates', methods=['POST'])
@jwt_required()
def create_template():
    """Create a new template for the current user."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    topics = data.get('topics')
    
    if not topics:
        return jsonify({'message': 'Topics are required'}), 400
    
    template = Template(topics=topics, user_id=user.id)
    db.session.add(template)
    db.session.commit()
    
    return jsonify({
        'id': template.id,
        'topics': template.topics
    }), 201

@template_bp.route('/templates', methods=['GET'])
@jwt_required()
def get_templates():
    """Get all templates for the current user."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    templates = Template.query.filter_by(user_id=user.id).all()
    templates_list = []
    
    for template in templates:
        templates_list.append({
            'id': template.id,
            'topics': template.topics
        })
    
    return jsonify(templates_list), 200

@template_bp.route('/templates/<int:template_id>', methods=['GET'])
@jwt_required()
def get_template(template_id):
    """Get a specific template by ID."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    template = Template.query.filter_by(id=template_id, user_id=user.id).first()
    
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    
    # Get stats for this template
    stats = []
    for stat in template.stats:
        stats.append({
            'topic': stat.topic,
            'difficulty': stat.difficulty,
            'trend': stat.trend
        })
    
    # Get exams for this template
    exams = []
    for exam in template.exams:
        exams.append({
            'id': exam.id
        })
    
    return jsonify({
        'id': template.id,
        'topics': template.topics,
        'stats': stats,
        'exams': exams
    }), 200

@template_bp.route('/templates/<int:template_id>', methods=['PUT'])
@jwt_required()
def update_template(template_id):
    """Update a specific template."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    template = Template.query.filter_by(id=template_id, user_id=user.id).first()
    
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    
    data = request.get_json()
    topics = data.get('topics')
    
    if topics:
        template.topics = topics
    
    db.session.commit()
    
    return jsonify({
        'id': template.id,
        'topics': template.topics
    }), 200

@template_bp.route('/templates/<int:template_id>', methods=['DELETE'])
@jwt_required()
def delete_template(template_id):
    """Delete a specific template."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    template = Template.query.filter_by(id=template_id, user_id=user.id).first()
    
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    
    db.session.delete(template)
    db.session.commit()
    
    return jsonify({'message': 'Template deleted successfully'}), 200

@template_bp.route('/templates/<int:template_id>/exams', methods=['POST'])
@jwt_required()
def create_exam(template_id):
    """Create a new exam from a template."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    template = Template.query.filter_by(id=template_id, user_id=user.id).first()
    
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    
    # Create a new exam
    exam = Exam(template_id=template.id)
    db.session.add(exam)
    db.session.commit()
    
    # TODO: Generate questions based on template topics
    # This would typically involve some AI/ML functionality
    # For now, we'll just return the created exam
    
    return jsonify({
        'id': exam.id,
        'template_id': exam.template_id
    }), 201

@template_bp.route('/exams', methods=['GET'])
@jwt_required()
def get_user_exams():
    """Get all exams for the current user."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Get all templates for the user
    templates = Template.query.filter_by(user_id=user.id).all()
    
    # Get all exams for all user templates
    exams_list = []
    for template in templates:
        for exam in template.exams:
            exams_list.append({
                'id': exam.id,
                'template_id': exam.template_id,
                'template_topics': template.topics,
                'question_count': len(exam.questions)
            })
    
    return jsonify(exams_list), 200

@template_bp.route('/templates/<int:template_id>/exams', methods=['GET'])
@jwt_required()
def get_template_exams(template_id):
    """Get all exams for a specific template."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    template = Template.query.filter_by(id=template_id, user_id=user.id).first()
    
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    
    exams_list = []
    for exam in template.exams:
        exams_list.append({
            'id': exam.id,
            'template_id': exam.template_id,
            'question_count': len(exam.questions)
        })
    
    return jsonify(exams_list), 200

@template_bp.route('/exams/<int:exam_id>', methods=['GET'])
@jwt_required()
def get_exam(exam_id):
    """Get a specific exam with its questions."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Find the exam
    exam = Exam.query.get(exam_id)
    
    if not exam:
        return jsonify({'message': 'Exam not found'}), 404
    
    # Make sure the exam belongs to a template owned by this user
    template = Template.query.get(exam.template_id)
    if template.user_id != user.id:
        return jsonify({'message': 'Unauthorized access to this exam'}), 403
    
    # Get questions for this exam
    questions_list = []
    for question in exam.questions:
        questions_list.append({
            'id': question.id,
            'type': question.type,
            'topic': question.topic,
            'options': question.options,
            # Don't include the answer in the response for security
        })
    
    return jsonify({
        'id': exam.id,
        'template_id': exam.template_id,
        'questions': questions_list
    }), 200

@template_bp.route('/exams/<int:exam_id>/questions/<int:question_id>/answer', methods=['POST'])
@jwt_required()
def submit_answer(exam_id, question_id):
    """Submit an answer for a question and update stats accordingly."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Find the exam and question
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'message': 'Exam not found'}), 404
    
    question = Question.query.get(question_id)
    if not question:
        return jsonify({'message': 'Question not found'}), 404
    
    # Make sure the exam belongs to a template owned by this user
    template = Template.query.get(exam.template_id)
    if template.user_id != user.id:
        return jsonify({'message': 'Unauthorized access to this exam'}), 403
    
    # Get the submitted answer
    data = request.get_json()
    submitted_answer = data.get('answer')
    if submitted_answer is None:
        return jsonify({'message': 'Answer is required'}), 400
    
    # Check if the answer is correct (simplified for this example)
    is_correct = submitted_answer.lower() == question.answer.lower()
    
    # Update stats based on the answer
    update_stats(template.id, question.topic, is_correct)
    
    return jsonify({
        'is_correct': is_correct,
        'correct_answer': question.answer
    }), 200

@template_bp.route('/exams/<int:exam_id>/questions/<int:question_id>/clarify', methods=['POST'])
@jwt_required()
def request_clarification(exam_id, question_id):
    """Request clarification for a question and update stats."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Find the exam and question
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'message': 'Exam not found'}), 404
    
    question = Question.query.get(question_id)
    if not question:
        return jsonify({'message': 'Question not found'}), 404
    
    # Make sure the exam belongs to a template owned by this user
    template = Template.query.get(exam.template_id)
    if template.user_id != user.id:
        return jsonify({'message': 'Unauthorized access to this exam'}), 403
    
    # Update stats to reflect that the user needed clarification
    update_stats(template.id, question.topic, False)
    
    # In a real app, you would generate a clarification using an AI/ML model
    # For now, return a simple message
    clarification = f"This question is about {question.topic}. Think about the key concepts related to this topic."
    
    return jsonify({
        'clarification': clarification
    }), 200

@template_bp.route('/templates/<int:template_id>/stats', methods=['GET'])
@jwt_required()
def get_template_stats(template_id):
    """Get all stats for a specific template."""
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    template = Template.query.filter_by(id=template_id, user_id=user.id).first()
    
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    
    stats_list = []
    for stat in template.stats:
        stats_list.append({
            'id': stat.id,
            'topic': stat.topic,
            'difficulty': stat.difficulty,
            'trend': stat.trend
        })
    
    return jsonify(stats_list), 200

# Helper function to update stats based on user performance
def update_stats(template_id, topic, is_correct):
    """Update the stats for a topic based on whether the answer was correct."""
    # Find the stat for this topic
    stat = Stat.query.filter_by(template_id=template_id, topic=topic).first()
    
    if not stat:
        # Create a new stat if it doesn't exist
        stat = Stat(
            topic=topic,
            difficulty=5.0,  # Middle difficulty to start
            trend="stable",
            template_id=template_id
        )
        db.session.add(stat)
    
    # Update difficulty based on answer correctness
    if is_correct:
        # If answer is correct, decrease difficulty (user understands better)
        stat.difficulty = max(1.0, stat.difficulty - 0.5)
        stat.trend = "decreasing" if stat.difficulty < 5.0 else "stable"
    else:
        # If answer is wrong or clarification requested, increase difficulty
        stat.difficulty = min(10.0, stat.difficulty + 1.0)
        stat.trend = "increasing" if stat.difficulty > 5.0 else "stable"
    
    db.session.commit()