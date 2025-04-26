from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

# Create blueprint
auth_bp = Blueprint('auth', __name__)

# These will be imported from main.py when the blueprint is registered
from main import db, jwt
from models import User, TokenBlocklist

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({'message': 'Missing fields'}), 400

    hashed_password = generate_password_hash(password)
    
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409
    
    new_user = User(username=username, password=hashed_password, email=email)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing fields'}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.username)
    
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'username': user.username,
        'email': user.email
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    
    # Store the JTI in the blocklist to invalidate the token
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    
    return jsonify(msg="Successfully logged out"), 200

# Callback function to check if a JWT is in the blocklist
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None