from rest_framework import serializers

from .models import Resource, StudyPlan, StudyStart


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"
        read_only_fields = ["user"]


class StudyStartSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyStart
        fields = ["id", "description", "order", "is_completed"]
        read_only_fields = ["id", "is_completed"]


class StudyPlanSerializer(serializers.ModelSerializer):
    steps = StudyStartSerializer(many=True, required=False)

    class Meta:
        model = StudyPlan
        fields = [
            "id",
            "title",
            "description",
            "is_completed",
            "created_at",
            "steps",
        ]
        read_only_fields = ["id", "is_completed", "created_at"]

    def create(self, validated_data):
        steps = validated_data.pop("steps", [])
        plan = StudyPlan.objects.create(**validated_data)

        StudyStart.objects.bulk_create([
            StudyStart(
                plan=plan,
                description=step["description"],
                order=step.get("order", index + 1),
            )
            for index, step in enumerate(steps)
        ])

        return plan
