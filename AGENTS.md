# Repository Agent Guide

## Status
- This repository is split into a React frontend and a Node backend.
- The frontend lives in `frontend/` and uses Vite, React, TypeScript, and Tailwind CSS.
- The backend lives in `backend/` and uses Node, Express, TypeScript, Mongoose, and MongoDB.
- Shared domain types and canonical game content live in `shared/`.
- No Cursor rules were found in `.cursor/rules/`.
- No `.cursorrules` file was found.
- No Copilot instructions were found in `.github/copilot-instructions.md`.

## Primary Commands

## Setup And Install
- Install all workspace dependencies from the repo root with `npm install`.
- Use the root `package-lock.json`; prefer `npm install` locally and `npm ci` in CI.
- The backend expects MongoDB; set `MONGODB_URI` if you are not using `mongodb://127.0.0.1:27017/stackoria`.

## Development
- Start frontend and backend together with `npm run dev` from the repo root.
- Start only the frontend with `npm run dev:frontend`.
- Start only the backend with `npm run dev:backend`.
- Frontend dev server runs on Vite defaults unless overridden.
- Backend listens on port `4000` by default unless `PORT` is set.

## Build
- Build both workspaces with `npm run build`.
- Build only the frontend with `npm run build:frontend`.
- Build only the backend with `npm run build:backend`.
- Frontend build runs `tsc -b` and then `vite build`.
- Backend build runs `tsc -p tsconfig.json`.

## Lint
- Lint the whole repo with `npm run lint`.
- Lint frontend only with `npm run lint:frontend`.
- Lint backend only with `npm run lint:backend`.
- There is no dedicated auto-fix script yet; use `npx eslint . --fix` inside the relevant workspace if needed.

## Tests
- No automated test runner is configured yet in either workspace.
- Do not invent `npm test` commands until a real test framework is added.

## Single-Test Guidance
- There is no single-test command yet because no test runner is installed.
- If Vitest is added to the frontend, prefer `npm run test --workspace frontend -- path/to/file.test.ts` or `npx vitest run path/to/file.test.ts`.
- If a Node test runner is added to the backend, prefer the narrowest command possible, for example `npm run test --workspace backend -- path/to/file.test.ts`.

## Repository Layout
- `frontend/` contains the web app.
- `frontend/src/App.tsx` contains the main game shell and screen flow.
- `frontend/src/lib/api.ts` contains frontend API calls to the backend.
- `frontend/src/index.css` defines Tailwind imports and reusable UI classes.
- `frontend/eslint.config.js`, `frontend/tailwind.config.cjs`, and `frontend/postcss.config.cjs` configure frontend tooling.
- `backend/` contains the Node API.
- `backend/src/server.ts` boots Express, connects MongoDB, and exposes API endpoints.
- `backend/src/models/` contains Mongoose models for challenge content, leaderboard entries, and lead captures.
- `backend/src/lib/seed.ts` seeds MongoDB with canonical challenge content and starter leaderboard rows.
- `shared/gameContent.ts` contains canonical challenge data used to seed MongoDB.
- `shared/types.ts` contains shared domain types used by both workspaces.

## Product Architecture Notes
- The game UI is rendered client-side in React.
- Challenge content is stored in MongoDB, not hardcoded in the frontend runtime path.
- The backend seeds the canonical challenge set into MongoDB on startup.
- Leaderboard entries are stored in MongoDB and fetched by the frontend.
- Lead capture submissions are stored in MongoDB, but there is no CRM integration yet.

## API Overview
- `GET /api/health` returns backend health.
- `GET /api/bootstrap` returns classes and the event leaderboard for initial frontend bootstrap.
- `GET /api/classes` returns stored challenge classes and dungeons.
- `GET /api/leaderboard` returns leaderboard rows; `mode` and `limit` are supported query params.
- `POST /api/leaderboard` creates a leaderboard entry.
- `POST /api/leads` stores final lead capture submissions after the result screen.

## Data Model Notes
- `GameClass` documents store class metadata, hints, and all six dungeons.
- `LeaderboardEntry` documents store nickname, class, score, completion time, HP, hints used, and boss status.
- `LeadCapture` documents store email capture data plus result metadata for future segmentation or CRM sync.
- Preserve the exact narrative stack labels from the brief:
  - `React`
  - `Java + Python`
  - `Docker + Kubernetes`
  - `RAG + LLL + RNN`
- Do not normalize `LLL` to another acronym unless requirements explicitly change.

## Code Style Overview
- Follow TypeScript strict mode in both workspaces.
- Prefer functional React components and hooks on the frontend.
- Keep backend modules focused: routing/bootstrap in `server.ts`, persistence in `models/`, seeding in `lib/`.
- Favor data-driven rendering and avoid repeated hardcoded UI markup.
- Preserve the mobile-first, fast-reading UX of the game.

## Imports And Dependencies
- Use named type imports where appropriate, for example `import type { Foo } from '../types'`.
- Group imports by external packages first, then local modules.
- Prefer shared types from `shared/types.ts` over duplicating domain interfaces.
- Do not add dependencies unless they clearly reduce complexity or unlock required functionality.
- Prefer browser APIs and Node built-ins before adding libraries.

## Formatting
- Use consistent single quotes and no semicolons, matching the current codebase.
- Keep JSX readable; break long props and complex conditionals across lines.
- Avoid style-only churn in untouched files.
- Reuse existing Tailwind patterns and component classes before inventing new ones.

## Types
- Prefer explicit interfaces for classes, dungeons, reports, API payloads, and leaderboard rows.
- Use union types for constrained values like screen state, result type, answer type, and mode.
- Avoid `any`.
- Keep shared domain types in `shared/types.ts`.
- Keep local component-only helper types near the component that uses them.

## Naming
- Use descriptive, domain-oriented names like `selectedClass`, `currentDungeon`, `leaderboard`, `report`, and `bootstrapStatus`.
- Match existing naming conventions: camelCase for variables/functions, PascalCase for components/types.
- Prefer names that reflect gameplay or platform meaning, not generic placeholders.
- Keep stable IDs content-friendly and human-readable.

## Frontend Guidelines
- Keep state transitions explicit and easy to follow.
- Derive computed data with `useMemo` only when it improves clarity or avoids repeated work.
- Keep side effects in `useEffect` narrow and deterministic.
- If `frontend/src/App.tsx` grows further, split views and helpers into `frontend/src/components/` and `frontend/src/lib/`.
- Treat API bootstrap, loading, and degraded-mode handling as part of the product UX, not an afterthought.

## Backend Guidelines
- Validate request payloads at route boundaries.
- Keep persistence rules in Mongoose schemas rather than scattered in route code.
- Fail loudly on startup if MongoDB connection or seed bootstrap fails.
- Keep API responses concise and frontend-friendly.
- Avoid leaking internal stack traces in user-facing JSON errors.

## Styling Guidelines
- Keep the fantasy-tech tone intentional, not generic.
- Prefer CSS variables and shared component classes over one-off utility explosions.
- Reuse `primary-button`, `secondary-button`, `option-card`, and `field` styles.
- Preserve strong contrast and keyboard focus visibility.
- Test layouts on narrow mobile widths before considering desktop complete.

## Accessibility
- Ensure interactive elements remain keyboard reachable.
- Do not communicate status by color alone.
- Keep button labels and section headings explicit.
- Preserve `prefers-reduced-motion` support.
- Treat HUD data like HP, hints, timer, and progress as user-critical information.

## Error Handling
- Guard against missing content or failed API bootstrap before rendering dependent UI.
- Keep user-facing fallbacks concise and useful.
- Avoid silent catch blocks unless the degraded behavior is intentional and harmless.
- The frontend may degrade gracefully on leaderboard save failures, but should still prefer backend persistence when available.

## Performance And Reliability
- Keep initial frontend payloads light.
- Avoid large client dependencies unless they materially improve the experience.
- Prefer simple transforms over heavyweight state libraries unless complexity clearly justifies them.
- Be careful with unnecessary rerenders in gameplay screens.
- Keep backend startup deterministic and seed operations idempotent.

## Testing Expectations
- When a test framework is added, start with logic tests for score calculation, report generation, API validation, and leaderboard sorting.
- Add component tests for class selection, dungeon answers, end screen rendering, and lead capture.
- Add backend integration tests for bootstrap, seeding, and leaderboard submission.
- Keep tests deterministic and avoid time-sensitive assertions without controlling time.

## Configuration And Secrets
- Do not commit real API keys or CRM credentials.
- Backend runtime configuration should come from environment variables.
- Document variables like `MONGODB_URI`, `PORT`, and `FRONTEND_ORIGIN` when setup docs are expanded.
- Keep example configuration safe and minimal.

## Source Control Expectations
- Check the worktree before editing.
- Do not overwrite unrelated local work.
- Keep changes scoped to the requested feature.
- Avoid committing generated artifacts unless intentionally tracked.

## Agent Workflow
- Re-scan the repo before major changes.
- Prefer reading `shared/types.ts`, `shared/gameContent.ts`, `frontend/src/App.tsx`, and `backend/src/server.ts` first.
- Run `npm run lint` and `npm run build` from the repo root after meaningful frontend or backend changes.
- If you add new tooling or commands, update this file with exact usage.

## Next Documentation Upgrades
- Add real test commands once Vitest or another runner exists.
- Document the MongoDB setup flow and seed behavior explicitly.
- Document future CRM integration once lead capture becomes persistent.
- Split frontend and backend architecture notes further if more modules or services are added.
