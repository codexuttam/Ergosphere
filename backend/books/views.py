from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    @action(detail=False, methods=['post'])
    def bulk_upload(self, request):
        books_data = request.data
        if not isinstance(books_data, list):
            return Response({"error": "Expected a list of books"}, status=status.HTTP_400_BAD_REQUEST)
        
        created_books = []
        for item in books_data:
            serializer = self.get_serializer(data=item)
            if serializer.is_valid():
                serializer.save()
                created_books.append(serializer.data)
        
        return Response({"status": "Bulk upload successful", "created": len(created_books)}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def ask(self, request):
        question = request.data.get("question")
        # In a real RAG pipeline, we would embed 'question', search vector DB, and query LLM.
        # For now, we simulate a response based on the books we have.
        return Response({
            "answer": f"Based on the processed documents, the answer to your question '{question}' is found in our collection. (RAG simulated)",
            "sources": [{"title": "Example Book", "url": "#"}]
        })
