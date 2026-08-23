from rest_framework import serializers
from .models import UserProfile
from datetime import date
import math

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )
    avatar = serializers.SerializerMethodField()
    daily_focus = serializers.SerializerMethodField()
    focus_history = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "username",
            "display_name",
            "avatar",
            "daily_focus",
            "weekly_goal",
            "focus_history",
        ]

    def get_avatar(self, obj):
        if not obj.avatar:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.avatar.url)

    def get_daily_focus(self, obj):
        today = date.today().isoformat()

        if isinstance(obj.focus_history, dict):
            seconds = obj.focus_history.get(today, 0)
            return math.ceil(seconds / 60)

        return 0

    def get_focus_history(self, obj):
        if isinstance(obj.focus_history, dict):
            return [
                {
                    "date": key,
                    "minutes": math.ceil(value / 60)
                }
                for key, value in obj.focus_history.items()
            ]

        return []