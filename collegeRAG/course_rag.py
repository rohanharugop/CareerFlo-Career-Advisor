import json
import os
from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains.llm import LLMChain

# Load embedding model
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
persist_directory = './chroma_courses_db'

# Vector DB setup
vectorstore = Chroma(
    persist_directory=persist_directory,
    embedding_function=embeddings
)
retriever = vectorstore.as_retriever()

# Strict prompt template: only return JSON response
prompt_template_str = """You are an AI assistant that extracts online course information.

Using the given context, return the response **only** in this exact JSON format and nothing else:

{{
  "CourseName" : String,
  "CourseDescrption" : String,
  "CourseLink" : String
}}

- Description must be only one sentence.
- Do not add any explanation, notes, or comments—just output the JSON object.

Context:
{context}

Question:
{question}
"""

prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=prompt_template_str
)

# Set up LLM
api_key = os.environ.get('Groq_APIKey')
llm = ChatOpenAI(
    model="llama3-70b-8192",
    openai_api_key=api_key,
    openai_api_base="https://api.groq.com/openai/v1"
)

# Chain setup
llm_chain = LLMChain(llm=llm, prompt=prompt)
stuff_chain = StuffDocumentsChain(
    llm_chain=llm_chain,
    document_variable_name="context"
)

rag_chain = RetrievalQA(
    retriever=retriever,
    combine_documents_chain=stuff_chain,
    return_source_documents=False
)

# Function for querying
def call_rag(question):
    response = rag_chain.invoke({"query": question})
    try:
        result = json.loads(response["result"].strip())
    except:
        result = {}
    print("\nResponse from RAG/LLM:\n", result)
    return {"result": result}
