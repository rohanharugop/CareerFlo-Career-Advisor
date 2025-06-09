from flask import Flask, request, jsonify
import rag
from course_recommendation import GroqLlama3Client
import course_rag

app = Flask(__name__)

# In-memory storage for demonstration
saved_colleges = []

# groq_client = GroqLlama3Client()

@app.route('/college-info', methods=['POST'])
def college_info():
    data = request.get_json()
    resp = rag.call_rag(data['prompt'])
    # You can use data['prompt'] if needed
    # college_json = {
    #     "college": {
    #         "name": "College-ABC",
    #         "CourseName": "Course-XYZ",
    #         "Fees": 12345.00,
    #         "ExpectedKCETCutoff": 1000,
    #         "Placement": ["HPE", "IBM"]
    #     }
    # }
    # return jsonify(college_json)
    return (resp)

@app.route('/save-college', methods=['POST'])
def save_college():
    college_data = request.get_json()
    try:
        saved_colleges.append(college_data)
        return jsonify({"status": "success"})
    except Exception:
        return jsonify({"status": "failure"}), 500

from flask import jsonify

from flask import Flask, request, jsonify
import course_rag


@app.route('/recommend-course', methods=['POST'])
def recommend_course():
    data = request.get_json()
    response = course_rag.call_rag(data['prompt'])
    return jsonify({"result": response['result']})

if __name__ == '__main__':
    app.run(port=5000)

    

@app.route('/', methods=['GET'])
def root():
    return jsonify({"message": "College API running"})

if __name__ == '__main__':
    app.run(debug=True)