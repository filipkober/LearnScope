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