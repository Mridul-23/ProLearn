from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


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