import os
import requests

class GroqLlama3Client:
    def __init__(self, api_key: str = None, model: str = "llama3-8b-8192"):
        self.api_key = api_key or os.environ.get("Groq_APIKey")
        if not self.api_key:
            raise ValueError("Groq_APIKey not provided or not set in environment.")
        self.model = model
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.system_template = """Give your Response **Exclusively** in the following JSON format:
Response = { "CourseName" : String,
            "CourseDescrption" : String,
            "CourseLink" : String
            }
Return response only in the JSON format shown above
Do not return anything which is not JSON
Do not add any note at the end
CourseDescription field should be a string only one sentence
CourseLink field should be a link to the course
Give Priority to Free Courses
"""

    def get_course_recommendation(self, topic: str) -> dict:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": self.system_template},
                {"role": "user", "content": f"Find a free online course on {topic}."}
            ],
            "temperature": 0.5
        }

        response = requests.post(self.api_url, headers=self.headers, json=payload)

        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            return {"success": True, "content": content}
        else:
            return {
                "success": False,
                "error": response.text,
                "status_code": response.status_code
            }
