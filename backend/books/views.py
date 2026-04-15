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
            # Simulated AI insight generation
            desc = item.get("description", "")
            if desc:
                # Mock AI: Sentiment analysis
                item["sentiment"] = "Positive" if any(w in desc.lower() for w in ["good", "great", "excellent", "beautiful", "love"]) else "Neutral"
                # Mock AI: Summary generation (truncated)
                item["summary"] = desc[:200] + "..." if len(desc) > 200 else desc
            
            serializer = self.get_serializer(data=item)
            if serializer.is_valid():
                serializer.save()
                created_books.append(serializer.data)
        
        if created_books:
            from .rag_service import RAGService
            RAGService.index_books()
            
        return Response({"status": "Bulk upload successful", "created": len(created_books)}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def recommend(self, request, pk=None):
        from django.core.cache import cache
        cache_key = f"recs_{pk}"
        cached_recs = cache.get(cache_key)
        
        if cached_recs:
            return Response(cached_recs)
            
        book = self.get_object()
        # Find books in same genre or with same rating
        recommendations = Book.objects.filter(genre=book.genre).exclude(id=book.id)[:5]
        if not recommendations:
            recommendations = Book.objects.filter(rating=book.rating).exclude(id=book.id)[:5]
        
        serializer = self.get_serializer(recommendations, many=True)
        cache.set(cache_key, serializer.data, 60*15) # Cache for 15 minutes
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def ask(self, request):
        question = request.data.get("question", "").lower().strip()
        if not question:
            return Response({"error": "No question provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # 1. Caching AI responses (Bonus)
        from django.core.cache import cache
        cache_key = f"rag_{hash(question)}"
        cached_res = cache.get(cache_key)
        if cached_res:
            return Response(cached_res)
            
        # 2. Complete RAG Pipeline Implementation
        from .rag_service import RAGService
        from .models import Interaction
        
        answer, sources = RAGService.get_contextual_answer(question)

        # 3. Saving chat history (Bonus)
        Interaction.objects.create(question=question, answer=answer)

        response_data = {
            "answer": answer,
            "sources": sources
        }
        cache.set(cache_key, response_data, 60*60) # Cache for 1 hour
        
        return Response(response_data)
