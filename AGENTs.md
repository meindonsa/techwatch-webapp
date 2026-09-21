## Context
Frontend of TechWatch: users subscribe to their favorite RSS feeds and read the news in the app.
Stack: Vue 3 (Composition API), TypeScript, Vite, Vue Router, Pinia, Tailwind 4, Axios.
- WebSocket: native browser API, no library.
- Tailwind 4 is configured in CSS (no `tailwind.config.js`); `@tailwindcss/typography` is available.
Node: ^20.19.0 or >=22.12.0.
The API lives in `../techwatch-api/src/` (read-only unless explicitly asked).

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build` (runs the type check, then the Vite build)
- Type check only: `npm run type-check`
- Format: `npm run format` (rewrites `src/`; run it before each commit)
- No linter and no test suite are configured. To validate a task: `npm run build`,
  then check the result in the browser with `npm run dev`.

## Architecture
- `CONTEXT/`: UI mockups. Read before any design or UI change.
- `src/core/`: assets, layout, router and global stores
- `src/features/`: one folder per feature (indicative list):
  - `auth`: login, register, forgot/reset password
  - `articles`: article list and details
  - `home`: home page, feeds (sources) and feed form
  - `user`: profile
- `src/shared/`: components, services and utilities used by several features.
  Code used by a single feature stays in that feature.

## Code conventions
- Views: PascalCase with `View` suffix (`ArticleDetailView.vue`)
- Components: PascalCase; composables: `useXxx`; <stores: ...>
- Vue: `<script setup lang="ts">`, Composition API only
- Reference feature to imitate: `src/features/<name>`

## Workflow
- Commits: Conventional Commits (feat, fix, docs, chore, etc.)
- One commit per unit of work (a feature, a fix, a doc)
- Branches must start with `borisaxel/`
- Never push to `master`, never use `--force`
- Before each push, check that `.env` is listed in `.gitignore`

## Limits
- Never read, edit or delete `.env` (`.env.example` may be read)
- Dependencies: always use the CLI (`npm i <package>`), never edit versions by hand
- Ask permission before:
  - installing a new dependency
  - changing the folder structure
  - modifying the router or a global store