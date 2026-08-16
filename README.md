# MedConnect — Clinical Case Collaboration Platform

A professional network for verified physicians to securely share and discuss clinical cases.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Auth | Better Auth (email/password + Google OAuth) |
| AI | Groq API (Llama 3.3 70B) |
| Testing | Vitest (client + server) |
| CI/CD | GitHub Actions |

---

## Project Structure

```
DoctorConnect/
├── client/          # React frontend (Vite)
├── server/          # Express backend
│   ├── prisma/      # Database schema & migrations
│   └── src/
│       ├── config/  # Auth, DB, email config
│       ├── middlewares/
│       ├── routes/
│       ├── utils/
│       └── __tests__/
├── .github/
│   └── workflows/   # CI pipeline
└── .env.example     # Environment variable template
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/DoctorConnect.git
cd DoctorConnect

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:
```
VITE_API_URL=http://localhost:5000
PORT=5000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-32-char-secret
GROQ_API_KEY=your-groq-api-key
ADMIN_ID=your-admin-username
ADMIN_PASSWORD=YourStrongPassword12+
ADMIN_TOKEN_SECRET=your-32-char-secret
```

### 3. Set Up Database

```bash
cd server
npx prisma db push
```

### 4. Run Development Servers

**Server** (port 5000):
```bash
cd server
npm run dev
```

**Client** (port 3000) — in a separate terminal:
```bash
cd client
npm run dev
```

Open `http://localhost:3000`

---

## Running Tests

```bash
# Server tests (22 tests)
cd server && npm test

# Client tests (20 tests)
cd client && npm test
```

---

## Admin Panel

Access at `http://localhost:3000/admin/login`

Set `ADMIN_ID` and `ADMIN_PASSWORD` in your `.env` file.

---

## Environment Variables Reference

See `.env.example` for the full list with descriptions.

**Optional — Email Verification (SMTP):**
```
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-api-key
EMAIL_FROM=noreply@yourdomain.com
```

Email verification is automatically enabled when SMTP is configured.

---

## Production Deployment

- **Server**: Deploy to [Render](https://render.com) — set all env vars in the dashboard
- **Client**: Deploy to [Vercel](https://vercel.com) — set `VITE_API_URL` to your Render URL
- **Database**: [Neon](https://neon.tech) PostgreSQL (free tier available)

> **Important**: Set `NODE_ENV=production` on your server deployment platform to enable secure cookies.

---

## Known Limitation

Image uploads are currently stored as base64 in PostgreSQL. For production at scale, migrate to an object storage service (Cloudinary, S3, or Supabase Storage). See `server/src/routes/uploads.ts`.
