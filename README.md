# GigCredit — Backend + Frontend (Hackathon Demo)

A working backend for the GigCredit fintech demo, wired up to the existing
frontend (homepage, login, worker dashboard, lender dashboard). All gig
platform and banking data is **mocked** — there are no real third-party
integrations. This is built for a hackathon demo, not production use.

## Stack
Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt · dotenv

## 1. Install

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if needed — the defaults point at a local MongoDB
(`mongodb://127.0.0.1:27017/gigcredit`). You need MongoDB running locally,
or point `MONGO_URI` at a hosted instance (e.g. MongoDB Atlas free tier).

## 3. (Optional but recommended) Seed demo data

This creates 3 demo workers with connected platforms/scores/wallets and one
demo lender, so the app has real data the moment you open it:

```bash
npm run seed
```

Demo logins printed at the end of the seed script:
- Workers: `alex@worker.com` / `priya@worker.com` / `marcus@worker.com` (password: `password123`)
- Lender: `lender@institution.com` (password: `password123`)

You can also just register fresh accounts from the login page — no seed data required.

## 4. Run

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

Then open **http://localhost:5000** — the Express server serves the
frontend directly (`/frontend`), so there's nothing extra to run. The
homepage, login, worker dashboard and lender dashboard are all wired to the
live API.

If you'd rather serve the frontend separately (e.g. VS Code Live Server),
that works too — CORS is open by default. Just make sure
`window.GIGCREDIT_API_BASE` in `frontend/js/api.js` points at
`http://localhost:5000/api` if the frontend isn't same-origin.

## How it fits together

- `login.html` → register or log in as a **Worker** or **Lender**, JWT stored in `localStorage`
- `worker.html` → dashboard pulls `/api/dashboard/worker`: GigCredit Score,
  monthly income, wallet balance, loan eligibility, connected platforms,
  loan marketplace, active loans. Buttons to connect a new gig platform,
  add/withdraw wallet funds, accept/reject loan offers, and pay EMIs are all
  live.
- `lender.html` → dashboard pulls `/api/dashboard/lender` for portfolio KPIs,
  lists all worker applicants (searchable), lets you send a targeted loan
  offer to any worker, and shows your loan portfolio.

## Folder structure

```
config/         MongoDB connection
middleware/     JWT auth + role authorization, error handler
models/         Worker, Lender, Wallet, LoanOffer, Loan
controllers/    Business logic per resource
routes/         Express routers (mounted in server.js)
utils/          GigCredit score model, mock data generators, seed script
frontend/       Your existing HTML pages + shared js/api.js client + page scripts
```

## GigCredit Score model (`utils/gigScore.js`)

A simple, transparent 300–900 score computed from:
- 40% earnings (average monthly gig income across connected platforms)
- 25% average rating (3.0–5.0 normalized)
- 20% reliability (cancellation rate + completed jobs)
- 15% account tenure (months connected)

Recalculated automatically whenever a worker connects/disconnects a
platform, or on demand via `POST /api/gigscore/recalculate`.

## Key REST endpoints

| Area       | Method & Path                              | Notes |
|------------|---------------------------------------------|-------|
| Auth       | `POST /api/auth/register`                   | `{ role, name, email, password, phone?, institutionName? }` |
| Auth       | `POST /api/auth/login`                       | `{ role, email, password }` |
| Auth       | `GET /api/auth/me`                           | Requires Bearer token |
| Worker     | `GET/PUT /api/workers/me`                    | |
| Worker     | `POST /api/workers/platforms/connect`        | `{ platform }` — simulates connecting a gig app |
| Worker     | `POST /api/workers/bank/connect`             | `{ bankName, accountNumber }` — simulated |
| Lender     | `GET /api/lenders/workers`                   | `?search=&minScore=&page=&limit=` |
| Lender     | `GET /api/lenders/workers/:id`               | |
| Dashboard  | `GET /api/dashboard/worker`                  | Everything the worker UI needs, in one call |
| Dashboard  | `GET /api/dashboard/lender`                  | Everything the lender UI needs, in one call |
| GigScore   | `GET /api/gigscore/me` / `POST /recalculate` | |
| Wallet     | `GET /api/wallet/me`, `/transactions`        | |
| Wallet     | `POST /api/wallet/add-money` / `/withdraw`   | `{ amount }` |
| Offers     | `GET /api/offers/worker`                     | Pre-approved + lender-issued offers |
| Offers     | `POST /api/offers/:id/accept` / `/reject`    | Accepting disburses funds + creates a Loan |
| Offers     | `POST /api/offers` (lender)                  | `{ workerId, title, amount, interestRate, tenureMonths }` |
| Loans      | `GET /api/loans/worker` / `/lender`          | |
| Loans      | `POST /api/loans/:id/repay`                  | `{ amount }` — simulates an EMI payment |

All protected routes require `Authorization: Bearer <token>`.

## Notes / limitations (intentional, for a hackathon demo)

- No real bank or gig-platform integrations — everything is generated with
  realistic random data (`utils/mockData.js`).
- Minimal input validation/security hardening — fine for a demo, **not**
  production-ready.
- One wallet per worker, one loan per accepted offer, simple linear EMI
  math — no amortization schedules, credit bureau checks, or KYC.
