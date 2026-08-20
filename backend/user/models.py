from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import json

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    interests = models.TextField(blank=True, help_text="Comma separated interests")
    
    # New Dashboard Stats
    daily_focus = models.IntegerField(default=0, help_text="Minutes focused today")
    weekly_goal = models.IntegerField(default=10, help_text="Weekly goal in hours")
    focus_history = models.JSONField(default=list, help_text="List of daily focus minutes for the last 7 days") # e.g. [45, 60, 75, 50, 85, 40, 95]
    
    def add_xp(self, amount):
        self.xp += amount
        # Simple level up logic: Level = 1 + XP // 100
        self.level = 1 + (self.xp // 100)
        self.save()

    def __str__(self):
        return f"{self.user.username} - Level {self.level}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Initialize with some default history for the demo
        default_history = [30, 45, 60, 20, 90, 45, 60]
        UserProfile.objects.create(user=instance, focus_history=default_history, daily_focus=60, weekly_goal=12)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
