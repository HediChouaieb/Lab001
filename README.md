# Carthage Library — Web Security Assessment Lab

> **IMPORTANT**: This project is an intentionally vulnerable application designed exclusively for authorized cybersecurity education and local laboratory environments.

## Project Overview

**Bibliothèque Publique de Carthage** is a simulated modern Tunisian public library registration portal that looks like a legitimate production-quality public-service website, while intentionally containing multiple web vulnerabilities for authorized security training and CTF exercises.

## Architecture

This is a **single Next.js project** containing both frontend and backend.

```
carthage-library-lab/
├── app/                    # Next.js App Router pages and API routes
│   ├── page.tsx            # Homepage
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── books/              # Book catalog
│   ├── profile/            # User profile
│   ├── dashboard/          # User dashboard
│   ├── announcements/      # Library announcements
│   ├── contact/            # Contact form
│   ├── admin/              # Admin dashboard
│   ├── lab/                # CTF lab dashboard
│   ├── .env/               # INTENTIONAL: Exposed env file
│   ├── debug/              # INTENTIONAL: Debug endpoint
│   └── api/                # API routes
│       ├── auth/           # Authentication
│       ├── users/          # User endpoints (IDOR vulnerable)
│       ├── books/          # Book endpoints
│       ├── library-cards/  # Library card endpoints (IDOR vulnerable)
│       ├── messages/       # Contact messages (Stored XSS)
│       ├── announcements/  # Announcements
│       ├── admin/          # Admin endpoints (Broken auth)
│       └── lab/            # Lab challenge system
├── lib/                    # Shared utilities
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # JWT authentication (weak config)
│   ├── config.ts           # INTENTIONAL: Exposed config
│   └── challenges.ts       # Challenge definitions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeder
├── Dockerfile
├── docker-compose.yml
└── .env
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (jsonwebtoken)
- **Containerization**: Docker & Docker Compose

## Installation

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Quick Start with Docker

```bash
docker compose up --build
```

The application will be available at:
- **Library Website**: http://localhost:3000
- **CTF Lab**: http://localhost:3000/lab
- **PostgreSQL**: localhost:5433 (internal only)

### Manual Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

## Database Setup

The database is automatically seeded with:

- **30 fictional users** with `@example.test` emails
- **100 books** across 10 categories
- **30 borrowing records**
- **15 announcements**
- **15 contact messages**
- **15 CTF challenges**

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| demo@example.test | password123 | Member |
| admin@example.test | admin123 | Admin |
| user1@example.test | password123 | Member |

## Available Routes

### Public Website

| Route | Description |
|-------|-------------|
| `/` | Homepage with library info |
| `/login` | User login |
| `/register` | New user registration |
| `/books` | Book catalog with search |
| `/announcements` | Library announcements |
| `/contact` | Contact form |
| `/dashboard` | User dashboard (auth required) |
| `/profile` | User profile (auth required) |
| `/admin` | Admin dashboard |

### Security Lab

| Route | Description |
|-------|-------------|
| `/lab` | CTF lab dashboard |
| `/debug` | Debug info endpoint |
| `/.env` | Exposed environment config |

### API Routes

| Endpoint | Method | Auth | Vulnerability |
|----------|--------|------|---------------|
| `/api/auth/login` | POST | None | Verbose errors |
| `/api/auth/register` | POST | None | None |
| `/api/users` | GET | None | IDOR, data over-exposure |
| `/api/users/[id]` | GET | None | IDOR |
| `/api/books` | GET | None | Reflected XSS, data over-exposure |
| `/api/library-cards` | GET | None | IDOR |
| `/api/library-cards/[id]` | GET | None | IDOR |
| `/api/messages` | GET/POST | None | Stored XSS |
| `/api/announcements` | GET | None | None |
| `/api/admin/users` | GET | None | Broken access control |
| `/api/admin/messages` | GET | None | Broken access control |
| `/api/debug` | GET | None | Info disclosure |

## Vulnerability Categories

This lab contains **15 intentional vulnerabilities** across the OWASP Top 10:

### 1. Configuration Exposure
- `/.env` route exposes environment configuration
- Debug endpoint exposes internal system information

### 2. Client-Side Secret Exposure
- Frontend JavaScript bundle contains embedded configuration
- Visible through View Source / DevTools

### 3. API Security
- `/api/users` returns all user data without authentication
- Excessive data exposure (passwords, addresses)

### 4. Broken Access Control (IDOR)
- `/api/users/[id]` - Access any user by changing ID
- `/api/library-cards/[id]` - Access any library card
- Admin endpoints have no authorization checks

### 5. Cross-Site Scripting (XSS)
- **Reflected XSS**: Book search parameter reflected unsafely
- **Stored XSS**: Contact messages and announcements rendered with `dangerouslySetInnerHTML`
- **DOM XSS**: Client-side search uses `innerHTML` with user input

### 6. Weak Authentication
- Demo accounts with weak passwords
- Verbose login error messages reveal account existence
- Low bcrypt salt rounds (4)

### 7. JWT Misconfiguration
- Weak signing secret (`lab_secret_123`)
- Long token expiry (7 days)

### 8. Security Misconfiguration
- Missing security headers (CSP, X-Frame-Options, etc.)
- Permissive CORS (`Access-Control-Allow-Origin: *`)
- Debug mode enabled

### 9. Information Disclosure
- Debug endpoint exposes system internals
- API responses contain more data than needed

## CTF Challenges

Access the challenge dashboard at: **http://localhost:3000/lab**

### Challenge List

| # | Title | Difficulty | Points | Flag |
|---|-------|-----------|--------|------|
| 01 | Exposed Environment Configuration | Easy | 50 | `FLAG{CARTHAGE_ENV_EXPOSED}` |
| 02 | Frontend Secret Discovery | Easy | 50 | `FLAG{FRONTEND_CONFIG_FOUND}` |
| 03 | Public User Database | Easy | 75 | `FLAG{PUBLIC_USERS_API}` |
| 04 | Broken Object-Level Authorization | Medium | 100 | `FLAG{BROKEN_OBJECT_AUTH}` |
| 05 | Reflected XSS | Medium | 100 | `FLAG{REFLECTED_XSS}` |
| 06 | Stored XSS | Medium | 125 | `FLAG{STORED_XSS}` |
| 07 | DOM-Based XSS | Hard | 150 | `FLAG{DOM_XSS_SINK}` |
| 08 | Weak Authentication | Easy | 75 | `FLAG{WEAK_AUTH_DEMO}` |
| 09 | JWT Misconfiguration | Medium | 100 | `FLAG{JWT_WEAK_SECRET}` |
| 10 | Debug Endpoint | Easy | 50 | `FLAG{DEBUG_ENDPOINT_FOUND}` |
| 11 | Missing Security Headers | Medium | 75 | `FLAG{HEADERS_MISSING}` |
| 12 | CORS Misconfiguration | Medium | 100 | `FLAG{CORS_WIDE_OPEN}` |
| 13 | Excessive API Data Exposure | Medium | 75 | `FLAG{EXCESSIVE_DATA_EXPOSURE}` |
| 14 | Admin Access Control Bypass | Hard | 150 | `FLAG{ADMIN_AUTHZ_BYPASS}` |
| 15 | Final Security Assessment | Hard | 200 | `FLAG{CARTHAGE_ASSESSMENT_COMPLETE}` |

**Total Possible Points: 1,400**

### Lab Features

- **Challenge Cards**: Browse all 15 challenges with difficulty ratings
- **Flag Submission**: Submit flags to earn points
- **Evidence System**: Document findings with severity ratings
- **Investigation Timeline**: Track your progress through the assessment
- **Progress Tracking**: See completed challenges and total points

## Resetting the Lab

To reset the entire lab to its initial state:

```bash
# With Docker
docker compose down -v
docker compose up --build

# Without Docker
npx prisma migrate reset --force
npx prisma db seed
```

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running and accessible:
```bash
docker compose ps
```

### Port Conflicts

If port 3000 or 5433 is in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change host port
```

### Prisma Issues

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Security Disclaimer

> **This project is an intentionally vulnerable application designed exclusively for authorized cybersecurity education and local laboratory environments.**
>
> - Use only fake data
> - Use only fictional credentials
> - Use only localhost/Docker
> - Do not use real API keys
> - Do not connect to real external systems
> - Do not use real government information
> - Do not use real people's personal information
> - Do not include real production secrets
> - Do not implement functionality intended to attack external systems
>
> The vulnerabilities are intentional and must remain confined to this application.

## License

Educational use only. Not for production deployment.
