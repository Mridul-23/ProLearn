# ProLearn Frontend

The frontend application for **ProLearn**, an AI-powered learning platform built with React and Vite.

## 🛠️ Tech Stack

* **React 18**
* **Vite**
* **React Router**
* **React Flow**
* **Tailwind CSS**
* **Google Gemini API**
* **Axios**

## 🚀 Development

From the `frontend` directory:

```bash
npm install
npm run dev
```

The Vite development server will start the frontend locally.

## ⚙️ Environment Configuration

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

`VITE_API_URL` specifies the URL of the ProLearn Django REST API.

> **Note:** Gemini API keys are provided by users through ProLearn's BYOK flow and are not configured as frontend environment variables.

## 🏗️ Production

The frontend is deployed on **Vercel** and communicates with the production Django REST API through the configured `VITE_API_URL`.

---
