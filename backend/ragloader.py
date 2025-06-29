import os
import torch
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma  # Corrected import

# === Paths ===
markdown_path = "CollegeInfo/allinfo.md"
persist_directory = "./chroma_db_bge"

# === Load and validate document ===
loader = UnstructuredMarkdownLoader(markdown_path)
documents = loader.load()
assert len(documents) == 1 and isinstance(documents[0], Document)
print(documents[0].page_content[:250])  # preview

# === Preprocess & Split ===
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n##", "\n\n", "\n", ".", " "]  # Preserve headings like ## BMS KCET CUTOFF - SC
)
splits = text_splitter.split_documents(documents)

# === Add Category Metadata ===
for doc in splits:
    if "CUTOFF - SC" in doc.page_content:
        doc.metadata["category"] = "SC"
    elif "CUTOFF - ST" in doc.page_content:
        doc.metadata["category"] = "ST"
    elif "CUTOFF - OBC" in doc.page_content:
        doc.metadata["category"] = "OBC"
    else:
        doc.metadata["category"] = "General"

# === Embedding Model ===
embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5",
    model_kwargs={"device": "cuda" if torch.cuda.is_available() else "cpu"},
)

# === Vectorstore Initialization ===
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    persist_directory=persist_directory
)