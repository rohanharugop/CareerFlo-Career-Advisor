import glob
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_core.documents import Document


persist_directory = r'./chroma_db'
# Path to all .md files in the folder
markdown_path = "CollegeInfo/allinfo.md"
loader = UnstructuredMarkdownLoader(markdown_path)

data = loader.load()
assert len(data) == 1
assert isinstance(data[0], Document)
readme_content = data[0].page_content
print(readme_content[:250])


from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(chunk_size = 1500, chunk_overlap = 400)
splits = text_splitter.split_documents(data)

from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma

# Load a local embedding model from Hugging Face
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Create your vectorstore
vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings, persist_directory=persist_directory)

# Persist the vectorstore to disk
# vectorstore.persist()
