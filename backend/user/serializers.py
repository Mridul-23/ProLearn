from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['username', 'xp', 'level', 'interests', 'daily_focus', 'weekly_goal', 'focus_history']
