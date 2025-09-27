# Repository Guidelines

## Project Structure & Module Organization
The Vite + Express monorepo is split into `client/`, `server/`, and `shared/`. React code lives in `client/src` with feature folders (`components/`, `pages/`, `hooks/`, `lib/`, `i18n/`, `types/`); `@/` resolves to this tree. Re-use types and Drizzle tables from `shared/schema.ts` through `@shared/`. Express boots from `server/index.ts`, wiring routes, email helpers, storage, and Vite dev middleware. Leave generated assets under `attached_assets/` untouched.

## Build, Test & Development Commands
- `npm install` — install dependencies once per machine.
- `npm run dev` — start Express via `tsx`; Vite middleware serves the client.
- `npm run build` — run `vite build` then bundle `server/index.ts` to `dist/`.
- `npm run start` — execute the bundled server with `NODE_ENV=production`.
- `npm run check` — TypeScript project check with no emit.
- `npm run db:push` — sync `shared/schema.ts` to Postgres through Drizzle.

## Coding Style & Naming Conventions
Strict TypeScript is enforced; keep `npm run check` clean before committing. Use two-space indentation and double-quoted imports to match existing files. React components and pages stay PascalCase, hooks follow `use-*`, and shared utilities live in `client/src/lib`. Favor Tailwind utilities, extending tokens in `tailwind.config.ts` instead of adding bespoke CSS.

## Testing Guidelines
No automated runner ships yet, so document manual checks (contact form, appointment booking, `/en` toggle) in every PR. When introducing automation, use `vitest` with React Testing Library for the client and `supertest` for Express routes, storing specs in `client/src/__tests__` or `server/__tests__`. Update `tsconfig.json` includes if `*.test.ts[x]` files are added.

## Commit & Pull Request Guidelines
History favors concise imperative subjects (for example "Improve email sending functionality with detailed error logging"); follow that pattern and isolate logical changes per commit. PRs should include a short summary, screenshots or logs for user-facing work, notes on environment variables, and the tests you ran. Seek review before merge and keep future CI checks green.

## Environment & Configuration
Provide a `.env` with `DATABASE_URL`, `SENDGRID_API_KEY`, and optionally `PORT`. `drizzle.config.ts` requires `DATABASE_URL` even during builds; run `npm run db:push` after editing `shared/schema.ts`. Outbound email currently uses `karacsony.barni@gmail.com`; change `server/email.ts` if ownership shifts. Avoid logging secrets by using the logger in `server/vite.ts`.

## General Learnings
- Shell commands run through PowerShell, so classic Unix helpers like `sed` or `awk` may be unavailable; fall back to `pwsh` cmdlets, Node, or Python for file inspection.
- Multi-line snippets should use PowerShell here-strings (e.g., `@'... '@` with `Set-Content`); heredocs like `cat <<'PY'` are parsed by PowerShell and fail.
- `python -c` quoting is brittle under PowerShell because double quotes terminate the command and backslashes are literal; prefer temporary script files or wrap the code in double quotes while using single quotes inside.
- For quick replacements, `(Get-Content -Raw path).Replace(needle, replacement) | Set-Content` reliably preserves Windows newlines.
- `Select-String` treats patterns as regex by default; add `-SimpleMatch` when the search text contains quotes or other regex metacharacters.

