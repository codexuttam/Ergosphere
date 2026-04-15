import os
import google.generativeai as genai
from .models import Book
from django.conf import settings
from dotenv import load_dotenv
from pathlib import Path

# Compatibility patch for ChromaDB on Linux
try:
    __import__('pysqlite3')
    import sys
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
except ImportError:
    pass

import chromadb
from chromadb.utils import embedding_functions

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent

# 1. Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# 2. Configure ChromaDB (Vector Database)
chroma_client = chromadb.PersistentClient(path=str(BASE_DIR / "vector_db"))
# Use Gemini for embeddings in Chroma
gemini_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(
    api_key=os.getenv("GOOGLE_API_KEY")
)
collection = chroma_client.get_or_create_collection(
    name="book_catalog", 
    embedding_function=gemini_ef
)

class RAGService:
    @staticmethod
    def index_books():
        """Indexes all books from MySQL/SQLite into ChromaDB."""
        books = Book.objects.all()
        for book in books:
            content = f"Title: {book.title}\nGenre: {book.genre}\nSummary: {book.summary}\nDescription: {book.description}"
            collection.upsert(
                documents=[content],
                metadatas=[{"id": book.id, "title": book.title, "url": book.url}],
                ids=[str(book.id)]
            )
        print(f"Indexed {books.count()} books in ChromaDB.")

    @classmethod
    def get_contextual_answer(cls, question):
        clean_q = question.lower().strip()
        
        # --- LOCAL HANDLING ---
        if any(greet in clean_q for greet in ["hi", "hello", "hey", "how are you"]):
            return "Greetings! I am the Ergosphere Neural Engine. How can I assist you with the book catalog today?", []
            
        # --- VECTOR SEARCH (ChromaDB) ---
        try:
            results = collection.query(
                query_texts=[question],
                n_results=3
            )
            
            full_context = "CONTEXT FROM CATALOG:\n"
            sources = []
            
            if results['documents'] and results['documents'][0]:
                for i in range(len(results['documents'][0])):
                    full_context += f"- {results['documents'][0][i]}\n"
                    sources.append({
                        "title": results['metadatas'][0][i]['title'],
                        "url": results['metadatas'][0][i]['url']
                    })
            else:
                return "I couldn't find any relevant data in the vector store to answer that.", []
        except Exception as e:
            return f"Vector Search Error: {str(e)}", []

        # --- LLM GENERATION ---
        try:
            prompt_header = "You are the Ergosphere Insight Engine. Provide a direct, natural answer based on the catalog data below. DO NOT use asterisks (*) for bolding or lists. Use plain text only. If mentioning books, just use their titles without special formatting.\n\n"
            
            # Check for LM Studio (Option 2) or use Gemini (Option 1)
            lm_studio_url = os.getenv("LM_STUDIO_URL")
            
            if lm_studio_url:
                import requests
                response = requests.post(f"{lm_studio_url}/chat/completions", json={
                    "model": "local-model",
                    "messages": [
                        {"role": "system", "content": "Direct answer only, no markdown, no asterisks."},
                        {"role": "user", "content": f"{prompt_header}\nContext: {full_context}\n\nQuestion: {question}"}
                    ]
                })
                return response.json()['choices'][0]['message']['content'], sources
            else:
                # Option 1: Google Gemini
                model = genai.GenerativeModel('gemini-flash-latest')
                final_prompt = f"{prompt_header}CONTEXT:\n{full_context}\n\nUSER QUESTION: {question}"
                response = model.generate_content(final_prompt)
                
                clean_text = response.text.replace("*", "") # Safety strip for any remaining asterisks
                return clean_text, sources
                
        except Exception as e:
            return f"Intelligence Processing Interrupted: {str(e)}", sources
