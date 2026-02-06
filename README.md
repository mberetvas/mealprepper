# MealPrepper

A full-stack meal planning and recipe management application built with FastAPI and React. MealPrepper helps you organize, store, and manage your favorite recipes with an intuitive dashboard and powerful scraping capabilities.

[![API docs](img/login.png)](https://github.com/mberetvas/mealprepper)

## ✨ Features

- **Recipe Management**: Store, organize, and manage your recipes in one place
- **Web Scraping**: Automatically extract recipe data from popular cooking websites
- **User Authentication**: Secure login with JWT tokens and role-based access
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark Mode**: Eye-friendly dark theme for comfortable evening browsing
- **Email Integration**: Password recovery and notification support
- **Docker Support**: Easy deployment with Docker Compose

## 🛠️ Technology Stack

### Backend
- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) - Modern, fast web framework for building APIs with Python 3.7+
- 🧰 [**SQLModel**](https://sqlmodel.tiangolo.com) - SQL database toolkit for Python
- 🔐 [**JWT Authentication**](https://jwt.io) - Secure token-based authentication
- 🐘 [**PostgreSQL**](https://www.postgresql.org) - Powerful, open-source relational database
- 🔄 [**Alembic**](https://alembic.sqlalchemy.org) - Database migration tool

### Frontend
- 🚀 [**React**](https://react.dev) - Modern JavaScript library for building user interfaces
- 🎨 [**Tailwind CSS**](https://tailwindcss.com) - Utility-first CSS framework
- 🎣 [**TanStack Query**](https://tanstack.com/query) - Server state management
- 🧭 [**TanStack Router**](https://tanstack.com/router) - File-based routing
- 🦇 Dark mode support

### Infrastructure
- 🐋 [**Docker Compose**](https://www.docker.com) - Container orchestration for development and production
- 🌐 [**Traefik**](https://traefik.io) - Reverse proxy and load balancer
- 📦 [**uv**](https://docs.astral.sh/uv/) - Python package and environment manager

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [uv](https://docs.astral.sh/uv/)

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mberetvas/mealprepper.git
   cd mealprepper
   ```

2. Copy the environment file and configure your settings:
   ```bash
   cp .env.example .env
   ```
   
3. Generate secret keys:
   ```bash
   # For SECRET_KEY
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   
   # For POSTGRES_PASSWORD
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

4. Start the development environment:
   ```bash
   docker compose up -d
   ```

5. Access the application:
   - Frontend: [https://dashboard.localhost](https://dashboard.localhost)
   - Backend API: [https://api.localhost](https://api.localhost)
   - Adminer (DB UI): [https://adminer.localhost](https://adminer.localhost)

## 🏗️ Project Structure

```
mealprepper/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes and endpoints
│   │   ├── models/       # Database models
│   │   ├── crud/         # Database operations
│   │   ├── core/         # Core configuration
│   │   └── lib/          # Utilities (recipe scraper)
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── routes/       # Application routes
│   │   ├── client/       # Generated API client
│   │   └── hooks/        # Custom React hooks
├── img/                   # Project images
├── compose.yml            # Docker Compose configuration
└── .env                   # Environment variables
```

## 📋 Usage

### Managing Recipes

1. **Login** to your account or create a new one
2. **Add recipes** manually or use the recipe scraper
3. **Organize** your recipes with custom categories
4. **Plan meals** using your saved recipes

### Recipe Scraping

MealPrepper includes a powerful recipe scraper that can extract recipe information from popular cooking websites:

1. Navigate to the recipe management page
2. Paste the URL of the recipe you want to save
3. The application will automatically extract ingredients, instructions, and other details
4. Review and save the recipe to your collection

### Development Commands

#### Backend Development
```bash
# Activate virtual environment
cd backend
uv sync
source .venv/bin/activate

# Run tests
bash ./scripts/test.sh

# Run migrations
alembic revision --autogenerate -m "Migration message"
alembic upgrade head
```

#### Frontend Development
```bash
# Install dependencies
cd frontend
bun install

# Start development server
bun run dev
```

## 🧪 Testing

### Backend Tests
```bash
# Run all backend tests
bash ./scripts/test.sh

# Run tests in a running container
docker compose exec backend bash scripts/tests-start.sh
```

### Frontend Tests
```bash
# Run Playwright end-to-end tests
bunx playwright test
```

## 🚢 Deployment

For production deployment, refer to the [deployment.md](./deployment.md) documentation which covers:

- Production Docker Compose setup
- SSL certificate configuration with Traefik
- Environment variable configuration
- Database backup procedures

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

- `SECRET_KEY` - Secret key for security (generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- `FIRST_SUPERUSER_PASSWORD` - Password for the initial admin account
- `POSTGRES_PASSWORD` - Database password
- `SMTP_*` variables - Email configuration for notifications

## 🤝 Contributing

We welcome contributions! Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or check the [documentation](./development.md).

---

[Dashboard - Admin](img/dashboard.png) | [Dashboard - Items](img/dashboard-items.png) | [Dashboard - Dark Mode](img/dashboard-dark.png)
:---:|:---:

[Interactive API Documentation](img/docs.png)