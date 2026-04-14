from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=500)
    author = models.CharField(max_length=255, default="Unknown")
    description = models.TextField(blank=True, null=True)
    rating = models.CharField(max_length=50, blank=True, null=True)
    price = models.CharField(max_length=50, blank=True, null=True)
    url = models.URLField(max_length=1000)
    genre = models.CharField(max_length=100, blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    sentiment = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
