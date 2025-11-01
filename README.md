# Expense Tracker

Full-stack Expense Tracker built with a Vite + React client and an Express + MongoDB server.

This repository contains two main folders:

- `client/` — React frontend (Vite)
- `server/` — Node/Express backend with MongoDB

## Features

- User authentication (register / login)
- Create, update, delete expenses
- Expense filtering and simple charts/stats
- JWT-based auth for API

## Tech stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: MongoDB (Atlas or local)

## Prerequisites

- Node.js (v16+ recommended)
- npm (or pnpm/yarn)
- MongoDB instance (Atlas or local)

## Environment variables

Create a `.env` file in the `server/` folder with at least the following:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_secret
PORT=5000
```

Notes:
- If you use MongoDB Atlas, paste the connection string replacing username/password and DB name.
- `JWT_SECRET` is used to sign auth tokens.

## Install and run (development)

Open two terminals (one for server and one for client).

1) Server

```
cd server
npm install
# If package.json has a dev script using nodemon, you can run:
npm run dev
# Otherwise run:
node server.js
```

2) Client

```
cd client
npm install
npm run dev
```

By default the Vite client runs on `http://localhost:5173` (or as printed by Vite) and the server typically runs on `http://localhost:5000`.

If you want to run both with a single command, consider installing `concurrently` and creating a root-level script, or use tools like Docker / docker-compose. This repo currently expects you to run them separately.

## Build for production

1) Build client

```
cd client
npm run build
```

2) Serve the built client from a static server (or integrate with Express by serving `client/dist`). There is no automatic integration by default — adapt `server` to serve static files if desired.

## API overview

The server exposes endpoints under routes similar to:

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login (returns JWT)
- `GET /api/expenses` — get user's expenses (protected)
- `POST /api/expenses` — create expense (protected)
- `PUT /api/expenses/:id` — update expense (protected)
- `DELETE /api/expenses/:id` — delete expense (protected)

Exact route paths are in `server/routes/` (`authRoutes.js`, `expenseRoutes.js`).

## Important files

- `client/` — React source
  - `src/components` — UI components (Auth, Dashboard, Expenses, Layout)
  - `src/context/AuthContext.jsx` — auth context used by the client
- `server/` — backend
  - `server.js` — app entrypoint
  - `config/db.js` — MongoDB connection
  - `controllers/` — request handlers
  - `models/` — Mongoose models: `User.js`, `Expense.js`
  - `middleware/authMiddleware.js` — protects routes

## Assumptions

- I looked at the project structure and created this README using the repository layout you provided. I assumed:
  - `server` uses `node server.js` as the main entry or a `dev` script with nodemon.
  - `client` is a Vite app and uses `npm run dev` for local dev.

If your `package.json` scripts differ, update the commands above accordingly.

## Troubleshooting

- CORS errors: ensure the server's CORS settings allow the client origin (Vite origin during dev).
- Mongo connection issues: verify `MONGO_URI` and network access to the DB.
- Auth / JWT: ensure the same `JWT_SECRET` is used by code that signs and verifies tokens.

## Next steps / improvements

- Add a root `package.json` with a `dev` script that uses `concurrently` to run client+server.
- Add docker-compose for local dev with a MongoDB container.
- Add tests (Jest/Supertest for API, React Testing Library for client).

---

If you'd like, I can:

- update README with exact npm scripts by reading `client/package.json` and `server/package.json` (I can do that now), or
- add a root-level `README.md` with commands to run both using `concurrently` or a `docker-compose.yml` to run everything in containers.

Which would you prefer?
