# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router pages and API routes (`src/app/api/**/route.ts`).
- `src/app/editor/components/`: editor-specific UI modules.
- `src/components/`: shared React components; `src/components/ui/` contains shadcn/ui primitives.
- `src/lib/`: utilities, auth helpers, stores, and DB client/schema wrappers.
- `drizzle/`: database schema and SQL migrations (`drizzle/migrations/*.sql`).
- `public/`: static assets (example: `public/example-meme.png`).

## Build, Test, and Development Commands
- `pnpm install`: install dependencies.
- `pnpm dev`: run local dev server (`next dev -H 0.0.0.0`).
- `pnpm build`: build production assets.
- `pnpm start`: start production server.
- `pnpm lint`: run ESLint (Next.js core-web-vitals + TypeScript config).
- `pnpm db:generate`: generate Drizzle migration files.
- `pnpm db:migrate:dev`: apply D1 migrations locally.
- `pnpm db:migrate:prod`: apply D1 migrations to production Cloudflare environment.

## Coding Style & Naming Conventions
- Language: TypeScript with `strict` mode; avoid `any`.
- Indentation: 2 spaces; keep files formatted consistently with existing code.
- Components: use functional components + hooks; component filenames in `PascalCase` (for example, `AuthModal.tsx`).
- Utilities/stores: `kebab-case` or descriptive lowercase names (for example, `user-store.ts`, `utils.ts`).
- Imports: prefer aliases `@/*` and `@drizzle/*` from `tsconfig.json`.
- Styling: Tailwind CSS v4-first; compose classes with shared utility helpers.

## Testing Guidelines
- There is currently no automated test runner configured (no `test` script yet).
- Minimum contributor checks before opening a PR: `pnpm lint` and `pnpm build`.
- When adding tests, place them as `*.test.ts` / `*.test.tsx` near the feature or in a dedicated `tests/` directory, and keep names behavior-focused.

## Commit & Pull Request Guidelines
- Follow the repository’s existing commit style: conventional prefixes such as `feat:`, `fix:`, `refactor:`, `del:`.
- Keep commits scoped and atomic (one logical change per commit).
- PRs should include:
  - concise summary and motivation,
  - linked issue/task ID,
  - screenshots or short recordings for UI changes,
  - notes for env, migration, or deployment impacts.

## Security & Configuration Tips
- Keep secrets in `.env.local`; never commit credentials.
- Review `wrangler.toml` and D1 targets before running production migrations.
- Validate auth and API route changes under `src/app/api/` before deployment.
