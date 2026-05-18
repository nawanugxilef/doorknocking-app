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
