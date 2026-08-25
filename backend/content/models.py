from django.db import models
from django.contrib.auth.models import User

class Resource(models.Model):
    RESOURCE_TYPES = [
        ('video', 'Video'),
        ('article', 'Article'),
        ('ai_note', 'AI Note'),
        ('user_note', 'User Note')
    ]

    title = models.CharField(max_length=255)
    url = models.URLField(blank=True, null=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources')

    def __str__(self):
        return self.title

class StudyPlan(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_plans')
    created_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

class StudyStart(models.Model):
    plan = models.ForeignKey(StudyPlan, on_delete=models.CASCADE, related_name='steps')
    description = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return self.description
