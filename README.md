# AXIOM Logic

> AI Automation · Intelligent Workflows · Business Process Automation · Systems Integration · Scalable Digital Infrastructure

Premium enterprise AI automation platform. Built for high-end businesses that require intelligent, orchestrated, and scalable workflow automation.

---

## Architecture

```
GitHub (source of truth)
    │
    ├── Vercel → Full Next.js App (Frontend + API Routes)
    │
    └── Render → PostgreSQL Database
```

This is a **Next.js 16 full-stack monorepo**. The frontend and all API/backend logic live together in a single Next.js application. Vercel handles both the React frontend and the server-side API routes natively. There is no separate backend server.

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | Next.js 16 (App Router, React 19) | Vercel |
| API / Backend | Next.js API Routes (`app/api/`) | Vercel (same deploy) |
| Database | PostgreSQL + Prisma ORM | Render PostgreSQL |
| Auth | Custom HMAC-signed HttpOnly session cookies | — |
| Email | Resend (server-side only) | — |
| Route protection | Next.js `proxy.ts` (renamed from middleware in v16) | — |

---

## Access Architecture

| Route | Who | Authentication |
|-------|-----|---------------|
| `/` · `/solutions` · `/pricing` · etc. | Public | None |
| `/sign-in` | Public | None |
| `/connection` | Business users | Signed session cookie |
| `/admin/login` | AXIOM Admins only | Not linked publicly |
| `/admin` | AXIOM Admins only | ADMIN role required |
| `/book` | Public | None |

---

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally
- `npm`

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/darjidev0205/AXIOM-LOGIC.git
cd AXIOM-LOGIC

# 2. Install dependencies (Prisma client is auto-generated via postinstall)
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your local database URL and a generated AUTH_SECRET

# 4. Push the database schema
npm run prisma:push

# 5. Seed the database (optional)
npx tsx prisma/seed.ts

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Dev Login Credentials

In development, seeded users accept any password:

| Email | Role | Redirects to |
|-------|------|-------------|
| `marcus@acme.com` | ADMIN | `/admin` |
| `elena@acme.com` | ADMIN | `/admin` |
| `david@acme.com` | USER | `/connection` |

---

## Production Deployment

### 1. Render — PostgreSQL Database

1. Create a new **PostgreSQL** service on [Render](https://render.com)
2. Copy the **External Database URL**
3. Set this as `DATABASE_URL` in Vercel environment variables (see below)

### 2. Vercel — Full Application

#### Vercel Project Settings

| Setting | Value |
|---------|-------|
| **Framework** | Next.js |
| **Root Directory** | `.` (repository root) |
| **Build Command** | `npm run build` (runs `prisma generate && next build`) |
| **Output Directory** | `.next` (auto-detected) |
| **Install Command** | `npm install` |
| **Node.js Version** | 20.x |

#### Required Environment Variables on Vercel

Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Render PostgreSQL external URL | `postgresql://user:pass@host/db` |
| `AUTH_SECRET` | HMAC signing key (min 32 chars) | `openssl rand -hex 64` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel production URL | `https://axiom-logic.vercel.app` |
| `RESEND_API_KEY` | Resend email API key (server-side only) | `re_...` |
| `OPENAI_API_KEY` | Optional — mock responses used when missing | `sk-...` |
| `ANTHROPIC_API_KEY` | Optional | `sk-ant-...` |
| `N8N_WEBHOOK_URL` | Optional — automation webhook | |
| `N8N_API_KEY` | Optional | |

> ⚠️ **Never** prefix secrets with `NEXT_PUBLIC_`. Only `NEXT_PUBLIC_APP_URL` is exposed to the browser.

#### Post-Deploy: Run Database Migration

After first deploy, run the Prisma schema push via Vercel's terminal or a one-off command:

```bash
# From local, pointing at production DB
DATABASE_URL="your-render-url" npm run prisma:push
```

---

## Environment Variables Reference

| Variable | Required | Server/Client | Purpose |
|----------|----------|---------------|---------|
| `DATABASE_URL` | ✅ | Server | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Server | HMAC session signing key |
| `NEXT_PUBLIC_APP_URL` | ✅ | Client (public) | Frontend base URL |
| `RESEND_API_KEY` | Optional | Server | Transactional email |
| `OPENAI_API_KEY` | Optional | Server | AI features |
| `ANTHROPIC_API_KEY` | Optional | Server | AI features |
| `N8N_WEBHOOK_URL` | Optional | Server | Workflow automation |
| `N8N_API_KEY` | Optional | Server | n8n authentication |
| `CALENDAR_API_KEY` | Optional | Server | Calendar integrations |
| `SLACK_BOT_TOKEN` | Optional | Server | Slack notifications |
| `WHATSAPP_API_TOKEN` | Optional | Server | WhatsApp channel |

---

## Project Structure

```
/
├── app/                    # Next.js App Router (pages + API routes)
│   ├── api/                # Server-side API routes (the "backend")
│   │   ├── auth/           # Login / logout / session
│   │   ├── bookings/       # Booking system
│   │   ├── health/         # GET /api/health — uptime check
│   │   └── ...
│   ├── admin/              # Admin portal (AXIOM staff only)
│   ├── connection/         # Business user private workspace
│   ├── sign-in/            # Authentication page
│   └── ...                 # Public marketing pages
│
├── components/             # Shared React components
│   ├── navigation/         # TopNavBar, Footer
│   ├── brand/              # AxiomLogo, brand assets
│   └── ...
│
├── lib/                    # Server-side utilities
│   ├── auth.ts             # HMAC session management
│   ├── email.ts            # Resend email templates
│   └── prisma.ts           # Prisma client singleton
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Development seed data
│
├── services/               # Business logic services
├── public/                 # Static assets (logos, icons)
├── proxy.ts                # Next.js 16 route protection (auth middleware)
├── next.config.ts          # Next.js configuration
├── .env.example            # Environment variable template
└── .gitignore
```

---

## Security

- **Session cookies**: HttpOnly, Secure (production), signed with HMAC-SHA256
- **Role enforcement**: Server-side via `proxy.ts` — client cannot bypass
- **Email API key**: Server-side only — never exposed to browser
- **Database credentials**: Server-side only via `DATABASE_URL`
- **Security headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Secrets**: All secrets via environment variables — none hardcoded

---

## Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "service": "AXIOM Logic",
  "timestamp": "2026-09-12T10:00:00.000Z"
}
```

No authentication required. Use for Vercel/Render uptime monitoring.

---

## License

Private. © AXIOM Logic Inc. All rights reserved.
