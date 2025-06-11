import os
import json
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

load_dotenv()

# Set up embeddings and vector store
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory="./chroma_courses_db", embedding_function=embeddings)
retriever = vectorstore.as_retriever()

# Load LLM
api_key = os.getenv("Groq_APIKey")
llm = ChatOpenAI(
    model="llama3-70b-8192",
    openai_api_key=api_key,
    openai_api_base="https://api.groq.com/openai/v1"
)

# Prompt builder with format lock and example
def build_prompt(context, question):
    return f"""
You are an expert assistant extracting course information from educational content.

⚠️ STRICT INSTRUCTION: Respond ONLY in a valid JSON object using the exact field names and format below. Do not include any explanation, markdown, or commentary.

Format:
{{
  "CourseName": "string",
  "CourseDescription": "string",
  "CourseLink": "string"
}}

Example:
{{
  "CourseName": "Machine Learning with Python",
  "CourseDescription": "A beginner-friendly course covering ML concepts using Python.",
  "CourseLink": "https://example.com/ml-course"
}}

Context:
{context}

Question:
{question}

Output a single JSON object exactly in the format shown.
"""

# Trim long documents to reduce context overload
def trim_docs(docs, max_chars=4000):
    return "\n".join(doc.page_content for doc in docs)[:max_chars]

# Main call function
def call_rag(question):
    docs = retriever.get_relevant_documents(question)
    context = trim_docs(docs)

    prompt = build_prompt(context, question)

    for attempt in range(2):  # Retry once if necessary
        try:
            response = llm.invoke(prompt).content
            result = json.loads(response.strip())

            if isinstance(result, dict) and all(k in result for k in ["CourseName", "CourseDescription", "CourseLink"]):
                print("\nResponse from RAG/LLM:\n", result)
                return {"result": result}
        except Exception as e:
            print(f"[Attempt {attempt+1}] Error parsing response:", e)

    return {"result": {}}
