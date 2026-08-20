from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Resource, StudyPlan, StudyStart
from django.db.models import Q
import requests
from django.conf import settings
import json

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'
        read_only_fields = ['user']

class StudyStartSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyStart
        fields = '__all__'
        read_only_fields = ['plan']

class StudyPlanSerializer(serializers.ModelSerializer):
    steps = StudyStartSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudyPlan
        fields = '__all__'
        read_only_fields = ['user']

class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Simple content-based recommendation system.
        """
        user_plans = StudyPlan.objects.filter(user=request.user)
        keywords = set()
        for plan in user_plans:
            keywords.add(plan.title.lower())
            for word in plan.title.lower().split():
                if len(word) > 3:
                    keywords.add(word)
        
        if not keywords:
             return Response({"message": "Create a study plan to get recommendations.", "items": []})
        
        mock_global_resources = [
             {"title": "Advanced React Patterns", "type": "video", "url": "https://youtube.com", "tags": ["react", "frontend"]},
             {"title": "Django for Beginners", "type": "article", "url": "https://djangoproject.com", "tags": ["django", "python", "backend"]},
             {"title": "Machine Learning Crash Course", "type": "course", "url": "https://google.com", "tags": ["ml", "machine learning", "python"]},
             {"title": "CSS Grid Mastery", "type": "video", "url": "https://youtube.com", "tags": ["css", "frontend", "design"]},
             {"title": "Docker & Kubernetes", "type": "article", "url": "https://docker.com", "tags": ["devops", "cloud", "docker"]}
        ]
        
        recommended_items = []
        for res in mock_global_resources:
            score = 0
            res_text = (res['title'].lower() + " " + " ".join(res['tags']))
            for keyword in keywords:
                if keyword in res_text:
                    score += 1
            if score > 0:
                recommended_items.append(res)
                
        return Response({"items": recommended_items})


class ExternalResourceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def youtube(self, request):
        query = request.query_params.get('q')
        if not query:
            return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        items = []
        try:
            # Attempt 1: Custom Scrape (Fast & No API Key)
            import requests
            import re
            import json
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            res = requests.get(f"https://www.youtube.com/results?search_query={query}", headers=headers)
            
            # Extract ytInitialData
            matches = re.findall(r'var ytInitialData = ({.*?});', res.text)
            if matches:
                data = json.loads(matches[0])
                contents = data['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents']
                
                for item in contents:
                    if 'videoRenderer' in item:
                        vid = item['videoRenderer']
                        title = vid.get('title', {}).get('runs', [{}])[0].get('text', 'No Title')
                        videoId = vid.get('videoId')
                        channel = vid.get('ownerText', {}).get('runs', [{}])[0].get('text', 'Unknown Channel')
                        
                        if videoId and title:
                             items.append({
                                "id": {"videoId": videoId},
                                "snippet": {
                                    "title": title,
                                    "channelTitle": channel
                                }
                             })
                        if len(items) >= 5:
                            break
        except Exception as e:
            print(f"YouTube Scrape Error: {e}")
            
        return Response({"items": items})

    @action(detail=False, methods=['get'])
    def medium(self, request):
        import feedparser
        query = request.query_params.get('q')
        if not query:
             return Response({"error": "Query parameter 'q' is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # RSS Feed for tags: https://medium.com/feed/tag/{tag}
            # We'll treat the first word of query as the main tag
            tag = query.split()[0].lower()
            feed_url = f"https://medium.com/feed/tag/{tag}"
            feed = feedparser.parse(feed_url)
            
            items = []
            for entry in feed.entries[:5]:
                items.append({
                    "id": entry.get('id', entry.get('link')),
                    "title": entry.get('title'),
                    "url": entry.get('link'),
                    "author": entry.get('author', 'Medium Writer')
                })
            
            return Response({"items": items})
        except Exception as e:
            print(f"Medium Search Error: {e}")
            return Response({"items": []})

class StudyPlanViewSet(viewsets.ModelViewSet):
    serializer_class = StudyPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudyPlan.objects.filter(user=self.request.user)
        
    def perform_create(self, serializer):
        plan = serializer.save(user=self.request.user)
        self.generate_study_steps(plan)
    
    def generate_study_steps(self, plan):
        if not getattr(settings, 'OPENROUTER_API_KEY', None):
            self._generate_fallback_steps(plan)
            return

        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8000",
        }

        prompt = f"""
        Generate a strictly ordered list of 5 study steps to master '{plan.title}'. 
        Description context: {plan.description}.
        Return ONLY a raw JSON array of strings, like: ["Step 1", "Step 2", ...]. 
        Do not include markdown formatting or extra text.
        """

        data = {
            "model": getattr(settings, 'OPENROUTER_MODEL', "openai/gpt-3.5-turbo"),
            "messages": [{"role": "user", "content": prompt}]
        }

        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=10
            )
            response.raise_for_status()
            res_json = response.json()
            content = res_json['choices'][0]['message']['content'].strip()
            
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()

            steps = json.loads(content)
            if not isinstance(steps, list):
                steps = [content]

            for i, step_desc in enumerate(steps[:5]):
                 StudyStart.objects.create(
                     plan=plan,
                     description=step_desc,
                     order=i+1,
                     is_completed=False
                 )
        except Exception as e:
            print(f"AI Generation Error: {e}")
            self._generate_fallback_steps(plan)

    def _generate_fallback_steps(self, plan):
        steps = [
            f"Introduction to {plan.title}",
            "Core Concepts",
            "Advanced Topics",
            "Practice Projects",
            "Mastery Assessment"
        ]
        for i, step_desc in enumerate(steps):
             StudyStart.objects.create(
                 plan=plan,
                 description=step_desc,
                 order=i+1,
                 is_completed=False
             )

class AITutorView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def chat(self, request):
        message = request.data.get('message')
        
        # MOCK LOGIC: If no key or error, return a heuristic response
        if not getattr(settings, 'OPENROUTER_API_KEY', None):
             return self._get_mock_reply(message)

        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8000",
        }
        
        system_prompt = "You are a helpful AI Tutor for ProLearn. Be concise, encouraging, and educational."
        
        data = {
            "model": getattr(settings, 'OPENROUTER_MODEL', "openai/gpt-3.5-turbo"),
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        }
        
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=10
            )
            res_json = response.json()
            reply = res_json['choices'][0]['message']['content']
            return Response({"reply": reply})
        except Exception as e:
            print(f"AI Chat Error: {e}")
            return self._get_mock_reply(message)

    def _get_mock_reply(self, message):
        msg = message.lower()
        if "react" in msg:
            return Response({"reply": "React is a JavaScript library for building user interfaces. Key concepts include Components, Props, State, and Hooks. What would you like to know more about?"})
        elif "python" in msg:
            return Response({"reply": "Python is a versatile language known for its readability. It's great for web dev, data science, and scripting. Need help with syntax or libraries?"})
        elif "hello" in msg or "hi" in msg:
            return Response({"reply": "Hello! I'm your AI Tutor. Ask me about any programming topic!"})
        else:
            return Response({"reply": "That's an interesting topic! While I'm running in offline mode, I recommend checking the Resources tab for more in-depth tutorials on that."})
