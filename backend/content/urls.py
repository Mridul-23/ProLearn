from django.urls import path

from . import views

urlpatterns = [
    path("resources/", views.ResourceListCreateView.as_view(), name="resources",),
    path("resources/<int:pk>/", views.ResourceDetailView.as_view(), name="resource-detail",),
    path("study-plans/", views.StudyPlanListCreateView.as_view(), name="study-plans",),
    path("study-plans/<int:pk>/", views.StudyPlanDetailView.as_view(), name="study-plan-detail",),
    path("study-plans/<int:plan_id>/steps/<int:step_id>/", views.StudyStepToggleView.as_view(), name="study-step-toggle"),
    path("browse/youtube/", views.YouTubeSearchView.as_view(), name="youtube-search",),
    path("browse/medium/", views.MediumSearchView.as_view(), name="medium-search",),
]