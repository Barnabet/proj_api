# Project Setup & Usage

This repository contains a minimal full-stack proof-of-concept made of:

* **gateway** – Express API gateway with Google OAuth 2.0, JWT issuance and a protected `/api/v1/hello` endpoint.
* **frontend** – A super-light static site that hits the gateway and displays a friendly dashboard.
* **postgres** – Database used (future) by the gateway via Prisma.

Everything is containerised; you only need Docker & Docker Compose to run the stack.

---

## 1. Prerequisites

* Docker Engine ≥ 20.10
* Docker Compose ≥ v2 (bundled with recent Docker Desktop)
* Google OAuth credentials (Client ID & Client Secret)

Create a `.env` file at the repo root with the following variables (values shown are **examples only**):

```bash
GOOGLE_CLIENT_ID=123456789012-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-my-super-secret
JWT_SECRET=ultra-secret-jwt
SESSION_SECRET=some-session-secret
```

> The `docker-compose.yml` forwards those variables to the **gateway** container.

---

## 2. Run the stack

- Commands :
```bash
cd profile-service
npm install // dans gateway et profile-service 
npx prisma generate
npx prisma migrate dev --name init
docker compose up --build
```

```bash
# Build images and start everything in the background
docker compose up --build -d
```

Services & ports:

* Frontend:  http://localhost:5173
* Gateway  : http://localhost:4000
* Postgres : port **5432** (inside container: `proj_postgres`)

Logs (hit *Ctrl+C* to leave):

```bash
docker compose logs -f
```

Stop & remove containers:

```bash
docker compose down
```

---

## 3. Development tips

* The **gateway** runs on port 4000 and watches for file changes when started locally with `npm run dev`.
* The **frontend** is a static site; edit **HTML** files under `frontend/` and refresh your browser.
* DB data is persisted in the named volume `postgres-data`. Remove it with `docker volume rm <volume>` if you need a fresh start.

---

## 4. Running tests

Inside the `gateway/` folder:

```bash
npm install            # only needed once
npm test
```

---

## 5. Folder structure

```
.
├── gateway/      # Express + Passport + Prisma backend
├── frontend/     # Static client (served by `serve` in Docker)
├── docker-compose.yml
└── README.md
``` 