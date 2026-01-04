# Daily Games

A curated hub for discovering, tracking, and playing daily puzzle games. Users can browse games by category, create custom lists, track their play history and streaks, and use the "Feeling Lucky" feature to discover new challenges.

## Key Features

- **Daily Tracking**: Mark games as played to track your consistency. Progress resets automatically at midnight.
- **Streaks**: Maintain daily streaks for consistency.
- **Custom Lists**: Curate your own collections of favorite games.
  - Create, rename, delete lists.
  - "Add to List" quick action on every game card.
  - Filter the home page to view specific lists.
- **User Dashboard**:
  - **Stats**: View play counts, completion percentages, and category breakdowns.
  - **Lists**: Manage your custom game lists.
- **Admin Panel** (Owner/Co-owner):
  - **Game Management**: Add, edit, remove games.
  - **Site Settings**: Configure "New" badge duration, maintenance mode, welcome messages, and topic colors.
  - **User Management**: View users and manage roles.
- **Performance**:
  - Global state management for lists to minimize API requests.
  - Optimistic UI updates for instant feedback.

## Tech Stack

| Layer     | Technology                                                                     |
| --------- | ------------------------------------------------------------------------------ |
| Framework | [Next.js 16](https://nextjs.org) (App Router)                                  |
| Language  | TypeScript                                                                     |
| UI        | React 19, [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://radix-ui.com) |
| Styling   | [Tailwind CSS 4](https://tailwindcss.com)                                      |
| Database  | PostgreSQL via [Prisma ORM](https://prisma.io)                                 |
| Auth      | [Better Auth](https://better-auth.com) (Google OAuth)                          |
| State     | React Context + SWR-like patterns                                              |
| Icons     | [Lucide React](https://lucide.dev)                                             |

## File Structure

```
daily-games/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes (Auth, Games, Lists, Settings, User-Games)
│   ├── admin/                # Admin Panel (Games, Users, Settings)
│   ├── dashboard/            # User Dashboard (Stats, Lists)
│   ├── layout.tsx            # Global providers (Auth, Theme, Lists)
│   └── page.tsx              # Home page (Game Grid)
│
├── components/               # React components
│   ├── admin/                # Admin-specific forms and tables
│   ├── ui/                   # Reusable UI primitives (shadcn)
│   ├── game-card.tsx         # Game display card with actions
│   ├── games-client.tsx      # Main game grid controller
│   ├── games-header.tsx      # Filtering, search, and sorting
│   ├── lists-dropdown.tsx    # "Add to List" dialog
│   └── ...
│
├── lib/                      # Utilities and hooks
│   ├── auth-client.ts        # Client-side auth hooks
│   ├── use-lists.tsx         # Global Lists Context Provider
│   ├── use-played-games.ts   # Play tracking logic (Syncs LocalStorage <-> DB)
│   ├── streaks.ts            # Streak calculation helpers
│   └── prisma.ts             # Server-side DB client
│
├── prisma/                   # Database
│   ├── schema.prisma         # Data models (User, Game, UserGame, GameList, SiteConfig)
│   └── seed.ts               # Database seeder
│
└── public/                   # Static assets
```

## Getting Started

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Environment Setup**:
   Create a `.env` file with the following variables:

   ```env
   DATABASE_URL="postgresql://..."
   BETTER_AUTH_SECRET="..."
   BETTER_AUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```

3. **Database Setup**:

   ```bash
   # Create tables
   bunx prisma migrate dev

   # Seed initial data
   bunx tsx prisma/seed.ts
   ```

4. **Run Development Server**:
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.
