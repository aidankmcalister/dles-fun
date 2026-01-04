# Daily Games

A curated hub for discovering and tracking daily puzzle games. Users can browse games by category, mark games as played, and use the "Feeling Lucky" feature to randomly select an unplayed game.

## Tech Stack

| Layer         | Technology                                                                     |
| ------------- | ------------------------------------------------------------------------------ |
| Framework     | [Next.js 16](https://nextjs.org) (App Router)                                  |
| Language      | TypeScript                                                                     |
| UI            | React 19, [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://radix-ui.com) |
| Styling       | [Tailwind CSS 4](https://tailwindcss.com)                                      |
| Database      | PostgreSQL via [Prisma ORM](https://prisma.io)                                 |
| Auth          | [Better Auth](https://better-auth.com) (Google OAuth)                          |
| Notifications | [Sonner](https://sonner.emilkowal.ski)                                         |
| Effects       | [canvas-confetti](https://github.com/catdad/canvas-confetti)                   |

## File Structure

```
daily-games/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # Better Auth endpoints
│   │   └── games/            # Game CRUD + play tracking
│   ├── admin/                # Admin panel pages
│   ├── generated/            # Prisma generated client
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles + Tailwind
│
├── components/               # React components
│   ├── ui/                   # shadcn/ui primitives (Button, Card, etc.)
│   ├── admin/                # Admin-specific components
│   ├── game-card.tsx         # Individual game card
│   ├── game-grid.tsx         # Grid layout for games
│   ├── games-client.tsx      # Main games page client logic
│   ├── games-header.tsx      # Search, filters, sorting
│   ├── feeling-lucky-modal.tsx # Random game picker modal
│   ├── user-button.tsx       # Auth/user dropdown
│   └── theme-*.tsx           # Dark/light theme components
│
├── lib/                      # Utilities and config
│   ├── auth.ts               # Better Auth server config
│   ├── auth-client.ts        # Auth client hooks
│   ├── prisma.ts             # Prisma client singleton
│   ├── constants.ts          # Topics, colors, helpers
│   ├── played-state.ts       # LocalStorage play tracking
│   └── utils.ts              # cn() and helpers
│
├── prisma/                   # Database
│   ├── schema.prisma         # Data models (Game, User, Session, etc.)
│   ├── seed.ts               # Seed script for games
│   └── migrations/           # Database migrations
│
└── public/                   # Static assets
```

## Getting Started

```bash
# Install dependencies
bun install

# Set up your .env with DATABASE_URL and auth credentials

# Run database migrations
bunx prisma migrate dev

# Seed the database (optional)
bunx tsx prisma/seed.ts

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
