from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="Login"),
    path("signup/", views.SignupView.as_view(), name="Signup"),
    path("profile/", views.UserProfileView.as_view(), name="profile"),
    path("focus/", views.FocusTimeView.as_view(), name="focus"),
    path("token/", TokenObtainPairView.as_view(), name="token_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token")
]
