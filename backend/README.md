# ProLearn Backend

The backend API for **ProLearn**, built with Django and Django REST Framework.

## 🛠️ Tech Stack

* **Python**
* **Django**
* **Django REST Framework**
* **PostgreSQL**
* **Cloudinary**

## 🚀 Development

From the `backend` directory:

```bash
python -m venv .venv
```

Activate the virtual environment and install dependencies:

```bash
pip install -r requirements.txt
```

Apply migrations:

```bash
python manage.py migrate
```

Create a Django admin superuser if required:

```bash
python manage.py createsuperuser
```

Start the development server:

```bash
python manage.py runserver
```

## ⚙️ Environment Configuration

Create a `.env` file based on `.env.example` and configure the required Django, database, security, and Cloudinary settings.

> Never commit `.env` or real credentials to the repository.

## ☁️ Production

The Django REST API is deployed on **Vercel** and uses **Supabase PostgreSQL** for persistent database storage and **Cloudinary** for profile media.
