# dles.fun

[dles.fun](https://dles.fun) is a home for your daily word and logic games. Collect your favorites like Wordle and Connections into one clean dashboard. Track your played status, create custom lists, and race friends in real-time.

## Features

- **🎯 Daily Aggregator**: One centralized dashboard for all your daily browser games.
- **⚡ Races**: Challenge friends in real-time. Create a lobby, select games, and race to finish them first.
- **📊 Stats & Streaks**: Automatically track which games you've played today. Maintain streaks and view your race history.
- **📝 Custom Lists**: Organize games into routine-based lists (e.g., "Morning Coffee", "Speedrun").
- **🎲 Feeling Lucky**: Don't know what to play? Let the randomizer pick a game for you.

## Tech Stack

Built with the latest web technologies for speed and performance:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/) and [Prisma Postgres](https://www.prisma.io/postgres)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Real-time**: [Pusher](https://pusher.com/) (for Race lobbies)
- **Testing**: [Vitest](https://vitest.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Runtime & Package Manager)
- PostgreSQL Database

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/aidankmcalister/dles-fun.git
    cd dles-fun
    ```

2.  **Install dependencies**

    ```bash
    bun install
    ```

3.  **Environment Setup**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database (Want a temp DB? Run `npx create-db` for a Prisma Postgres connection string)
    DATABASE_URL="postgresql://user:password@localhost:5432/dles_fun"

    # Authentication (Better Auth)
    BETTER_AUTH_SECRET="your_secret_key"
    BETTER_AUTH_URL="http://localhost:3000"

    # Social Auth (Google)
    GOOGLE_CLIENT_ID="..."
    GOOGLE_CLIENT_SECRET="..."

    # Real-time (Pusher Channels)
    PUSHER_APP_ID="..."
    PUSHER_KEY="..."
    PUSHER_SECRET="..."
    PUSHER_CLUSTER="..."
    ```

4.  **Database Migration**

    Push the schema to your database:

    ```bash
    bunx prisma db push
    bunx prisma generate
    ```

    Seed the database:

    ```bash
    bunx prisma db seed
    ```

5.  **Run Development Server**

    ```bash
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## Testing

This project uses **Vitest** for unit and component testing.

```bash
# Run tests once
bun run test

# Run tests in watch mode
bun run test --watch
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Just want to suggest a game? Sign in and click the "Suggest a game" button in your profile dropdown.

## License

This project is open source and available under the [MIT License](LICENSE).
