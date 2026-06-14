# Doorknock MVP

Doorknock is a web application for managing volunteer doorknocking campaigns.

Current implementation covers Felix's scope:

- Public sign up and sign in
- Email verification with a six-digit, expiring one-time code
- JWT-based authentication
- Protected profile page
- Admin user management
- Role support for `ADMIN`, `VOLUNTEER_COORDINATOR`, and `DOORKNOCKER`
- Public sign up always creates a `DOORKNOCKER`
- `ADMIN` can promote users to coordinator or admin
- `VOLUNTEER_COORDINATOR` can edit user details but cannot change roles or delete users

## Stack

```text
backend/   Java Spring Boot + PostgreSQL
frontend/  Next.js + Tailwind CSS
```

## Roles

- `ADMIN`
  Full access to user management.
- `VOLUNTEER_COORDINATOR`
  Can view and edit user details, but cannot delete users or change roles.
- `DOORKNOCKER`
  Default role for everyone who signs up from the public landing page.

## Local Development

### Backend

Requirements:

- JDK 17+
- PostgreSQL

Run:

```bash
cd backend
./gradlew bootRun
```

Useful backend env variables:

```text
DATABASE_URL=<postgres connection string>
DATABASE_USERNAME=<postgres username>
DATABASE_PASSWORD=<postgres password>
JWT_SECRET=<base64 secret>
JWT_EXPIRATION_MS=86400000
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,https://*.vercel.app
BOOTSTRAP_ADMIN_ENABLED=true
BOOTSTRAP_ADMIN_FULL_NAME=Anthony Admin
BOOTSTRAP_ADMIN_EMAIL=admin@doorknock.test
BOOTSTRAP_ADMIN_PASSWORD=password123
AUTH_VERIFICATION_CODE_EXPIRY_MINUTES=15
AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS=60
APP_MAIL_FROM=no-reply@your-domain.com
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=<smtp username>
MAIL_PASSWORD=<smtp password>
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
```

### Frontend

Run:

```bash
cd frontend
npm install
npm run dev
```

Default frontend env:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## API Endpoints

```text
POST   /api/auth/register
POST   /api/auth/verify-email
POST   /api/auth/resend-verification
POST   /api/auth/login
GET    /api/users/me
PUT    /api/users/me
GET    /api/admin/users
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
GET    /api/health
```

## Admin Flow

- The first admin is bootstrapped from backend environment variables.
- Everyone else signs up from the public page as `DOORKNOCKER`.
- New public accounts must verify their email before signing in.
- Admin updates roles from the user management screen.

## Online Deployment

Live frontend:

- [https://frontend-seven-jet-53.vercel.app](https://frontend-seven-jet-53.vercel.app)

Live backend health check:

- [https://backend-production-358a.up.railway.app/api/health](https://backend-production-358a.up.railway.app/api/health)

Deployment model:

1. `backend/` deploys to Railway using Docker.
2. `frontend/` deploys to Vercel.
3. Vercel uses `NEXT_PUBLIC_API_BASE_URL` to talk to Railway.
4. Railway uses `APP_CORS_ALLOWED_ORIGINS` to allow the frontend domain.

Production backend env:

```text
DATABASE_URL=<railway postgres url>
JWT_SECRET=<base64 secret, minimum 32 bytes>
BOOTSTRAP_ADMIN_EMAIL=<first admin email>
BOOTSTRAP_ADMIN_PASSWORD=<first admin password>
BOOTSTRAP_ADMIN_FULL_NAME=<first admin name>
APP_CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://*.vercel.app
AUTH_VERIFICATION_CODE_EXPIRY_MINUTES=15
AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS=60
APP_MAIL_FROM=<verified sender address>
MAIL_HOST=<smtp host>
MAIL_PORT=587
MAIL_USERNAME=<smtp username>
MAIL_PASSWORD=<smtp password>
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
```
