from flask import Flask, request, jsonify
import os
import rag
import course_rag

app = Flask(__name__)
saved_colleges = []

@app.route('/college-info', methods=['POST'])
def college_info():
    data = request.get_json()
    return jsonify(rag.call_rag(data['prompt']))

@app.route('/save-college', methods=['POST'])
def save_college():
    try:
        saved_colleges.append(request.get_json())
        return jsonify({"status": "success"})
    except Exception:
        return jsonify({"status": "failure"}), 500

@app.route('/recommend-course', methods=['POST'])
def recommend_course():
    data = request.get_json()
    return jsonify(course_rag.call_rag(data['prompt']))

@app.route('/', methods=['GET'])
def root():
    return jsonify({"message": "College API running"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
