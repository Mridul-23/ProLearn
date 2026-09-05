from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import UserProfile, Audit
from .serializers import UserProfileSerializer, AuditSerializer

class SignupView(APIView):
  permission_classes = [AllowAny]

  def post(self, request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
      return Response({"error": "Username or password is not provided"},
                      status=status.HTTP_400_BAD_REQUEST)
  
    if User.objects.filter(username=username).exists():
      return Response({"error": "Username already exists"},
                      status=status.HTTP_400_BAD_REQUEST)
  
    user = User.objects.create_user(username=username, password=password)
    user.save()
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
  permission_classes = [AllowAny]

  def post(self, request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
      return Response({
        "error": "Username or password not provided"
      }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)

    if user is not None:
      access = AccessToken.for_user(user)
      refresh = RefreshToken.for_user(user)

      return Response({
        "access": str(access), "refresh" : str(refresh)
      }, status=status.HTTP_200_OK)
    
    return Response({"error": "Username or password is incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"error": "Current password and new password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not request.user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if current_password == new_password:
            return Response(
                {"error": "New password must be different from the current password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(new_password)
        request.user.save()

        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK
        )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile

            serializer = UserProfileSerializer(
                profile,
                context={"request": request}
            )
            return Response(serializer.data)

        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def patch(self, request):
        try:
            profile = request.user.profile

            serializer = UserProfileSerializer(
                profile,
                data=request.data,
                partial=True,
                context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class FocusTimeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            profile = request.user.profile
            seconds = int(request.data.get('seconds', 0))
            if seconds > 0:
                from datetime import date, timedelta
                today = date.today().isoformat()
                
                # Ensure focus_history is a dictionary
                if not isinstance(profile.focus_history, dict):
                    profile.focus_history = {}
                
                # Add seconds to today
                profile.focus_history[today] = profile.focus_history.get(today, 0) + seconds
                
                # Keep only last 7 days
                seven_days_ago = (date.today() - timedelta(days=6)).isoformat()
                keys_to_delete = [k for k in profile.focus_history.keys() if k < seven_days_ago]
                for k in keys_to_delete:
                    del profile.focus_history[k]
                    
                profile.save()
                
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

class AuditView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        audits = Audit.objects.filter(user=request.user)
        serializer = AuditSerializer(
            audits,
            many=True
        )
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AuditSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    