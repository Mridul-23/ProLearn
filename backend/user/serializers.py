from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Audit
from datetime import date
import math

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username"
    )
    avatar = serializers.ImageField(required=False, allow_null=True)
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

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Username cannot be empty.")

        user = self.instance.user

        if User.objects.filter(username=value).exclude(
            pk=user.pk
        ).exists():
            raise serializers.ValidationError(
                "Username already exists."
            )

        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        if "username" in user_data:
            instance.user.username = user_data["username"]
            instance.user.save(update_fields=["username"])

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.avatar:
            data["avatar"] = instance.avatar.url

        return data

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
class AuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = [
            "id",
            "timestamp",
            "source",
            "prompt",
            "ai_response",
        ]
        read_only_fields = [
            "id",
            "timestamp",
        ]