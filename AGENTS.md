# Repository Guidelines

## Project Structure & Module Organization
React code lives in `client/src` with feature folders (`components/`, `pages/`, `hooks/`, `lib/`, `i18n/`, `types/`); `@/` resolves to this tree.

## Build, Test & Development Commands
- `npm install` — install dependencies once per machine.
- `npm run check` — TypeScript project check with no emit.

## Coding Style & Naming Conventions
Strict TypeScript is enforced; keep `npm run check` clean before committing. Use two-space indentation and double-quoted imports to match existing files. React components and pages stay PascalCase, hooks follow `use-*`, and shared utilities live in `client/src/lib`. Favor Tailwind utilities, extending tokens in `tailwind.config.ts` instead of adding bespoke CSS.

## Commit & Pull Request Guidelines
History favors concise imperative subjects (for example "Improve email sending functionality with detailed error logging"); follow that pattern and isolate logical changes per commit. PRs should include a short summary, screenshots or logs for user-facing work, notes on environment variables, and the tests you ran. Seek review before merge and keep future CI checks green.

Whenever you merge a pull request, automatically delete its remote source branch and remove any clean local branch and worktree for that source branch. Do not delete `main`, protected branches, branches or worktrees with uncommitted changes, or a branch the user explicitly asked to preserve.

## Additional Project Notes
- Header navigation uses Wouter; scroll actions set a `pending-scroll-target` key in `sessionStorage` before navigating home, so reuse `handleScrollNavigation` when adding new in-page anchors.
- Terms and Privacy pages live in the `legal` i18n namespace; new legal copy must update `client/src/i18n/locales/{lang}/legal.json` and register imports in `client/src/i18n/index.ts`.
- Terms/Privacy mount effects call `window.scrollTo({ top: 0, behavior: "auto" })` to reset position; mirror this for future standalone routes.

## Audience Positioning
- The audience is independent, reflective adults who value precise concepts, transparent boundaries, and practical usefulness while remaining open to including emotions, the body, relationships, values, and existential experience in self-knowledge work.
- Keep the communication rational without reducing people to thought alone. Write concretely and with nuance; avoid dogma, pathologizing, flattery, spiritual certainty, and claims that one model explains the whole person. Preserve the visitor's autonomy.
- Never expose developmental levels, Wilber levels, or Spiral Dynamics categories in public-facing copy. Treat the integral model as a map rather than a finished explanation.
