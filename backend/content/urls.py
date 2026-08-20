from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourceViewSet, ExternalResourceViewSet, StudyPlanViewSet, AITutorView

router = DefaultRouter()
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'browse', ExternalResourceViewSet, basename='browse')
router.register(r'study-plans', StudyPlanViewSet, basename='study-plan')
router.register(r'ai-tutor', AITutorView, basename='ai-tutor')

urlpatterns = [
    path('', include(router.urls)),
]
