from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize database
def init_db():
    conn = sqlite3.connect('votes.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            temperature INTEGER
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/submit-vote', methods=['POST'])
def submit_vote():
    data = request.json
    temperature = data.get('temperature')

    if temperature is None:
        return jsonify({"error": "Temperature required"}), 400

    conn = sqlite3.connect('votes.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO votes (temperature) VALUES (?)", (temperature,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Vote recorded successfully!"})

@app.route('/get-average-temp', methods=['GET'])
def get_average_temp():
    conn = sqlite3.connect('votes.db')
    cursor = conn.cursor()
    cursor.execute("SELECT AVG(temperature) FROM votes")
    avg_temp = cursor.fetchone()[0]
    conn.close()

    return jsonify({"average_temperature": avg_temp})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')



import Adafruit_DHT
import sqlite3
import time

SENSOR = Adafruit_DHT.DHT22
PIN = 4  # GPIO pin

while True:
    humidity, temperature = Adafruit_DHT.read_retry(SENSOR, PIN)
    if temperature is not None:
        conn = sqlite3.connect('votes.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO votes (temperature) VALUES (?)", (temperature,))
        conn.commit()
        conn.close()
        print(f"Recorded temperature: {temperature}")
    time.sleep(60)  # Record every minute
