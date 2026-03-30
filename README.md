# Dungeons and Bugs

A fantasy-tech web game where the player chooses a class, clears six technical dungeons, and receives a final report with score, strengths, and improvement areas.

This project is a monorepo with a React frontend and a Node/Express backend. The canonical game content lives in `shared/` and is seeded into MongoDB when the backend starts.

## Stack

- Frontend: Vite, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Mongoose
- Database: MongoDB
- Shared: common types and game content in `shared/`

## Main features

- class selection and screen-based progression
- six dungeons per run with hints, HP, timer, and immediate feedback
- event leaderboard persisted in MongoDB
- final lead capture flow saved by the backend
- initial API bootstrap with game content and leaderboard data

## Repository structure

```text
.
|- frontend/   # React app
|- backend/    # Express API + MongoDB seed
|- shared/     # shared types and canonical game content
|- package.json
```

## Requirements

- Node.js 20+ recommended
- npm
- local MongoDB or a remote MongoDB URI

## Installation

```bash
npm install
```

## Backend configuration

Copy `backend/.env.example` to `backend/.env` and set the required values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/stackoria
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
```

If you do not set `MONGODB_URI`, the backend still defaults to `mongodb://127.0.0.1:27017/stackoria`.

## Development

Start frontend and backend together:

```bash
npm run dev
```

Start them separately:

```bash
npm run dev:frontend
npm run dev:backend
```

Default local URLs:

- frontend: `http://localhost:5173`
- backend: `http://localhost:4000`

## Build

```bash
npm run build
```

Build individual workspaces:

```bash
npm run build:frontend
npm run build:backend
```

## Lint

```bash
npm run lint
```

Lint individual workspaces:

```bash
npm run lint:frontend
npm run lint:backend
```

## Tests

There is currently no automated test runner configured.

## Main API endpoints

- `GET /api/health` backend health check
- `GET /api/bootstrap` classes and initial leaderboard
- `GET /api/classes` class and dungeon content
- `GET /api/leaderboard` leaderboard with `mode` and `limit` support
- `POST /api/leaderboard` create a new leaderboard entry
- `POST /api/leads` save the final lead capture submission

## Architecture notes

- the frontend does not rely on hardcoded runtime content; data comes from the backend
- the backend connects to MongoDB and runs an idempotent seed on startup
- leaderboard entries and leads are persisted in the database
- shared domain types live in `shared/types.ts`

## Useful files

- `frontend/src/App.tsx`
- `frontend/src/lib/api.ts`
- `backend/src/server.ts`
- `backend/src/lib/seed.ts`
- `shared/gameContent.ts`
- `shared/types.ts`

## Current status

The project does not yet include an automated test suite or CRM integrations for captured leads.
