from flask import Flask, request, jsonify
import rag
from course_recommendation import GroqLlama3Client

app = Flask(__name__)

# In-memory storage for demonstration
saved_colleges = []

groq_client = GroqLlama3Client()

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

@app.route('/recommend-course', methods=['POST'])
def recommend_course():
    data = request.get_json()
    topic = data.get("topic")

    if not topic:
        return jsonify({"error": "Missing 'topic' field in request body"}), 400

    result = groq_client.get_course_recommendation(topic)

    if result["success"]:
        print("Groq response:", result["content"])  # Print response to console
        return jsonify({"response": result["content"]})  # ✅ Proper dictionary

    else:
        print("Groq error:", result["error"])  # Print error to console
        return jsonify({"error": result["error"]}), result["status_code"]
    

@app.route('/', methods=['GET'])
def root():
    return jsonify({"message": "College API running"})

if __name__ == '__main__':
    app.run(debug=True)