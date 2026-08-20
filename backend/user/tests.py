from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationFlowTests(APITestCase):
    def test_signup_login_refresh_and_authenticated_profile(self):
        signup = self.client.post(
            '/user/signup/', {'username': 'learner', 'password': 'strong-password-123'}, format='json'
        )
        self.assertEqual(signup.status_code, status.HTTP_201_CREATED)

        login = self.client.post(
            '/user/login/', {'username': 'learner', 'password': 'strong-password-123'}, format='json'
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.assertIn('access', login.data)
        self.assertIn('refresh', login.data)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        profile = self.client.get('/user/profile/')
        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.data['username'], 'learner')

        refresh = self.client.post('/user/token/refresh/', {'refresh': login.data['refresh']}, format='json')
        self.assertEqual(refresh.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh.data)

    def test_login_and_profile_reject_invalid_credentials(self):
        User.objects.create_user(username='learner', password='strong-password-123')

        login = self.client.post(
            '/user/login/', {'username': 'learner', 'password': 'incorrect'}, format='json'
        )
        self.assertEqual(login.status_code, status.HTTP_401_UNAUTHORIZED)

        profile = self.client.get('/user/profile/')
        self.assertEqual(profile.status_code, status.HTTP_401_UNAUTHORIZED)
