import json
import re

import requests

from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Resource, StudyPlan, StudyStart
from .serializers import ResourceSerializer, StudyPlanSerializer


class ResourceListCreateView(ListCreateAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResourceDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(
            user=self.request.user
        )


class StudyPlanListCreateView(ListCreateAPIView):
    serializer_class = StudyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StudyPlanDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = StudyPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyPlan.objects.filter(
            user=self.request.user
        )


class StudyStepToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, plan_id, step_id):
        try:
            step = StudyStart.objects.get(
                id=step_id,
                plan_id=plan_id,
                plan__user=request.user,
            )
        except StudyStart.DoesNotExist:
            return Response(
                {"error": "Study step not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        step.is_completed = request.data.get(
            "is_completed",
            not step.is_completed
        )
        step.save(update_fields=["is_completed"])

        plan = step.plan

        plan.is_completed = (
            plan.steps.exists()
            and not plan.steps.filter(is_completed=False).exists()
        )

        plan.save(update_fields=["is_completed"])

        return Response({
            "id": plan.id,
            "title": plan.title,
            "description": plan.description,
            "is_completed": plan.is_completed,
            "steps": [
                {
                    "id": s.id,
                    "description": s.description,
                    "is_completed": s.is_completed,
                    "order": s.order,
                }
                for s in plan.steps.all()
            ],
        })


class YouTubeSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("q")
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=400
            )

        try:
            response = requests.get(
                "https://www.youtube.com/results",
                params={"search_query": query},
                headers={"User-Agent": "Mozilla/5.0"},
                timeout=10,
            )
            response.raise_for_status()

            match = re.search(
                r"var ytInitialData = ({.*?});",
                response.text
            )
            if not match:
                return Response({"items": []})

            data = json.loads(match.group(1))
            contents = (
                data["contents"]["twoColumnSearchResultsRenderer"]
                ["primaryContents"]["sectionListRenderer"]
                ["contents"][0]["itemSectionRenderer"]["contents"]
            )

            items = []
            for item in contents:
                video = item.get("videoRenderer")
                if not video:
                    continue

                video_id = video.get("videoId")
                title = video.get("title", {}).get("runs", [{}])[0].get("text")
                channel = video.get("ownerText", {}).get("runs", [{}])[0].get("text")

                if video_id and title:
                    items.append({
                        "id": {"videoId": video_id},
                        "snippet": {
                            "title": title,
                            "channelTitle": channel or "Unknown Channel",
                        },
                    })

                if len(items) == 5:
                    break

            return Response({"items": items})

        except Exception as e:
            print(f"YouTube error: {e}")
            return Response({"items": []})


class MediumSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("q")
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=400
            )

        try:
            import feedparser

            feed = feedparser.parse(
                f"https://medium.com/feed/tag/{query.split()[0].lower()}"
            )

            items = [
                {
                    "id": entry.get("id", entry.get("link")),
                    "title": entry.get("title"),
                    "url": entry.get("link"),
                    "author": entry.get("author", "Medium Writer"),
                }
                for entry in feed.entries[:5]
            ]

            return Response({"items": items})

        except Exception as e:
            print(f"Medium error: {e}")
            return Response({"items": []})
