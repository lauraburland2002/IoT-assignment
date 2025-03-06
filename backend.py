from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///votes.db'  # SQLite database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database model for storing votes
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temperature = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# Route to submit a vote
@app.route('/submit_vote', methods=['POST'])
def submit_vote():
    data = request.json
    if 'temperature' not in data:
        return jsonify({"error": "Temperature missing"}), 400
    
    vote = Vote(temperature=data['temperature'])
    db.session.add(vote)
    db.session.commit()
    
    return jsonify({"message": "Vote submitted successfully"}), 201

# Route to get the average temperature
@app.route('/average_temp', methods=['GET'])
def average_temp():
    votes = Vote.query.all()
    if not votes:
        return jsonify({"average_temperature": None, "message": "No votes yet"})
    
    avg_temp = sum(v.temperature for v in votes) / len(votes)
    return jsonify({"average_temperature": round(avg_temp, 2)})

# Initialize the database
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
