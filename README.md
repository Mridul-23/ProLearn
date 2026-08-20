# ProLearn

ProLearn is a full-stack learning companion for organizing study plans, saving learning resources, and getting help from an AI tutor. It pairs a React/Vite frontend with a Django REST API and uses JWT authentication for protected user data.

## Project details

### Learning workflow

- Create an account and sign in to access personal learning data.
- Build study plans, follow generated steps, and track learning progress.
- Save resources and explore relevant YouTube and Medium content.
- Use the dashboard to review focus time, goals, XP, and level.

### Application architecture

- The React/Vite frontend provides the dashboard, study-planning, resource, and tutor interfaces.
- The Django REST API stores user profiles, resources, and study plans in SQLite.
- JWT access and refresh tokens keep protected sessions active while preventing unauthenticated access to user data.

### AI Integration

- OpenRouter can generate study-plan steps and AI tutor responses when an API key is configured.
- Built-in fallback guidance keeps the tutor usable when OpenRouter is unavailable.

## What it includes

- Account signup, login, logout, and token refresh
- A dashboard with focus, goals, XP, and learning-level data
- Personal study plans with generated study steps
- Saved resources plus YouTube and Medium search endpoints
- An AI tutor endpoint with a fallback response when no OpenRouter key is available

## Tech stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS, Chart.js
- Backend: Django, Django REST Framework, Simple JWT, SQLite

## Run locally

Prerequisites: Node.js 18+ and Python 3.10+.

1. Install backend dependencies from the project root:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. Initialize and start the Django API:

   ```powershell
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```

3. In a second terminal, install and start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Open the address printed by Vite (normally `http://localhost:5173`). The frontend expects the API at `http://127.0.0.1:8000`.

## Configuration

Copy `backend/.env.example` to `backend/.env` and provide a Django secret key. Add an OpenRouter key to enable AI responses; without one, the tutor returns built-in fallback guidance. Never commit production secrets or API keys to source control.

## API overview

Public authentication endpoints:

- `POST /user/signup/`
- `POST /user/login/`
- `POST /user/token/refresh/`

Authenticated endpoints include `GET /user/profile/` and the resource, browsing, study-plan, and AI-tutor routes under `/api/`. Send access tokens as `Authorization: Bearer <token>`.

## Verification

```powershell
# Backend
cd backend
python manage.py test user

# Frontend
cd frontend
npm run lint
npm run build
```

## License

This project is available under the [MIT License](LICENSE).
