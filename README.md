# Doorknock MVP

Felix scope implementation:

- Admin / doorknocker sign up
- Admin / doorknocker sign in
- JWT protected profile endpoint
- Profile settings page
- Role support for `ADMIN`, `VOLUNTEER_COORDINATOR`, and `DOORKNOCKER`
- Public sign up creates doorknocker accounts only
- Admin user management page can promote doorknockers into coordinators

## Project Structure

```text
backend/   Spring Boot API
frontend/  Next.js + Tailwind CSS app
```

## Backend

Requirements:

- JDK 17+
- PostgreSQL

Run:

```bash
cd backend
./gradlew bootRun
```

Default database config:

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/doorknock
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
```

API endpoints:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/users/me
PUT  /api/users/me
GET    /api/admin/users
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
```

Development admin seed:

```text
admin@doorknock.test
password123
```

## Frontend

Run:

```bash
cd frontend
npm install
npm run dev
```

Default API URL:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Deploy Online

Recommended MVP deployment:

1. Deploy `backend/` to Render, Railway, or Fly using Docker.
2. Deploy `frontend/` to Vercel.
3. Set frontend env `NEXT_PUBLIC_API_BASE_URL` to the backend URL.
4. Set backend env `APP_CORS_ALLOWED_ORIGINS` to the Vercel frontend URL.

Backend required env:

```text
DATABASE_URL=<postgres connection string>
JWT_SECRET=<base64 secret, minimum 32 bytes>
BOOTSTRAP_ADMIN_EMAIL=<first admin email>
BOOTSTRAP_ADMIN_PASSWORD=<first admin password>
APP_CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

Backend health check:

```text
GET /api/health
```
