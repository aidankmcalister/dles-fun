---
description: Project conventions and AI assistant rules for daily-games
---

## Package Manager

Always use **bun** for this project:

- `bun install` - install dependencies
- `bun dev` - start dev server
- `bun run build` - build for production
- `bunx` - run package binaries (e.g., `bunx prisma migrate dev`)

Do NOT use npm, yarn, or pnpm.

## Database

- Prisma ORM with Prisma Postgres
- Run migrations: `bunx prisma migrate dev`
- Generate client: `bunx prisma generate`
- Seed data: `bun prisma db seed`

## Code Style

- TypeScript strict mode
- React components in `components/`
- UI primitives in `components/ui/` (shadcn/ui)
- Utilities in `lib/`
