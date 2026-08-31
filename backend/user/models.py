from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from collections import deque


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    weekly_goal = models.IntegerField(
        default=10,
        help_text="Weekly goal in hours"
    )

    focus_history = models.JSONField(
        default=dict,
        help_text="Map of date string to focus seconds for the last 7 days"
    )

    # Editable profile
    display_name = models.CharField(
        max_length=100,
        blank=True
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.user.username} Profile"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(
            user=instance,
            focus_history={},
            weekly_goal=10
        )


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, "profile"):
        instance.profile.save()


class Audit(models.Model):
    SOURCE_CHOICES = [
        ("ai_tutor", "AI Tutor"),
        ("study_plan", "Study Plan"),
        ("unknown", "Unknown"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="audit_history")
    timestamp = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="unknown")
    prompt = models.TextField()
    ai_response = models.TextField()

    class Meta:
        ordering = ["-timestamp", "-id"]
        indexes = [models.Index(fields=["user", "-timestamp", "-id"])]

    def __str__(self):
        return f"{self.user.username} - {self.source} - {self.timestamp}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        latest_ids = (
            Audit.objects
            .filter(user=self.user)
            .order_by("-timestamp", "-id")
            .values_list("id", flat=True)[:20]
        )

        Audit.objects.filter(user=self.user).exclude(
            id__in=latest_ids
        ).delete()