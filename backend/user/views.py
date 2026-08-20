from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import UserProfile
from .serializers import UserProfileSerializer

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

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
