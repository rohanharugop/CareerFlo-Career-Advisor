import os
import json
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

load_dotenv()

# Set up embedding and vector store
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embedding_model)
retriever = vectorstore.as_retriever()

# Load LLM
api_key = os.getenv("Groq_APIKey")
llm = ChatOpenAI(
    model="llama3-70b-8192",
    openai_api_key=api_key,
    openai_api_base="https://api.groq.com/openai/v1"
)

# Prompt Template with example output
def build_prompt(context, question):
    return f"""
You are an assistant helping users extract structured college information.

Respond ONLY in a list of **exactly 3 JSON objects** using the following format. No extra text or comments.

Format:
{{
  "name": "string",
  "CourseName": "string",
  "Fees": number,
  "ExpectedKCETCutoff": number,
  "CompanyNames": ["string", "string", "string"]
}}

Example Output:
[
  {{
    "name": "ABC College of Engineering",
    "CourseName": "Computer Science and Engineering",
    "Fees": 200000,
    "ExpectedKCETCutoff": 1234,
    "CompanyNames": ["Infosys", "TCS", "Google"]
  }},
  ...
]

Ensure:
- Only 3 JSON objects
- All strings in double quotes
- No explanation, headers, markdown, or extra notes
- The CompanyNames field must be of 3 items
Context:
{context}

Question:
{question}
"""

# Trim long docs to ~4000 characters
def trim_docs(docs, max_chars=4000):
    return "\n".join(doc.page_content for doc in docs)[:max_chars]

# Robust JSON parser for partial lists
def parse_json_array(raw_str):
    try:
        return json.loads(raw_str.strip())
    except Exception as e:
        print("Warning: malformed JSON, attempting line-by-line parsing.")
        parts = raw_str.strip()[1:-1].split('},')
        fixed = []
        for part in parts:
            item = part.strip()
            if not item.endswith('}'):
                item += '}'
            try:
                fixed.append(json.loads(item))
            except:
                continue
        return fixed[:3]  # return only top 3 items

# Final RAG call function
def call_rag(question):
    docs = retriever.get_relevant_documents(question)
    context = trim_docs(docs)
    prompt = build_prompt(context, question)

    for attempt in range(2):
        try:
            response = llm.invoke(prompt).content
            print("\nResponse from RAG/LLM:\n", response)
            parsed = parse_json_array(response)
            return parsed
        except Exception as e:
            print(f"[Attempt {attempt+1}] Parsing failed: {e}")
    
    return []

# Local test
if __name__ == "__main__":
    test_question = (
        "Recommend 3 engineering courses offered by engineering colleges for a student who's "
        "interested in maths and physics and has a general rank of 1500. Include the average cutoff."
    )
    result = call_rag(test_question)
    print(json.dumps(result, indent=2))
