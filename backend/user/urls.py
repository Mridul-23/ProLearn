from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="Login"),
    path("signup/", views.SignupView.as_view(), name="Signup"),
    path("change-password/", views.ChangePasswordView.as_view(), name="change_password"),
    path("profile/", views.UserProfileView.as_view(), name="profile"),
    path("focus/", views.FocusTimeView.as_view(), name="focus"),
    path("audit/", views.AuditView.as_view(), name="audit"),
    path("token/", TokenObtainPairView.as_view(), name="token_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token")
]
