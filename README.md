<div align="center">
  <img src="public/logo-dles.png" alt="dles.fun" width="120" />
</div>

# dles.fun

[dles.fun](https://dles.fun) is the ultimate home for your daily word and logic games. Collect your favorites like Wordle, Connections, and many more into one clean, premium dashboard. Track your play streak, create custom lists, and race friends in real-time.

## ✨ Features

### 🎮 For Players

- **Daily Aggregator**: One centralized, premium dashboard for all your daily browser games.
- **⚡ Races**: Challenge friends in real-time.
  - **Lobby System**: Create a lobby, invite friends via link.
  - **Live Progress**: See opponent progress in real-time.
  - **Modal Play**: Play compatible games directly inside the race interface without leaving.
- **📊 Stats & Streaks**: Automatically track which games you've played.
- **📝 Custom Lists**: Organize games into routine-based lists (e.g., "Morning Coffee", "Speedrun").
- **🎲 Feeling Lucky**: Let the randomizer pick a game for you.

### 🎥 For Streamers

- **Streamer Overlay**: A dedicated, clean overlay mode for races designed to be captured in OBS.

### 🛠️ For Admins & Community

- **Community Submissions**: Users can suggest new games to be added to the platform.

## 🏗️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom "Dark Terminal" aesthetic.
- **Database**: [Prisma ORM](https://www.prisma.io/) with [Prisma Postgres](https://www.prisma.io/postgres).
- **Authentication**: [Better Auth](https://better-auth.com/) (Google & Guest Access).
- **Real-time**: [Pusher](https://pusher.com/) (WebSockets for Races).
- **State Management**: React Server Components + Client Hooks.
- **Package Manager**: [Bun](https://bun.sh/).

## 🚀 Getting Started

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

    Create a `.env` file in the root directory. You can copy `.env.example` if available, or use the template below:

    You can get a temp database setup by running `npx create-db`

    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/dles_fun"

    # Authentication (Better Auth)
    BETTER_AUTH_SECRET="your_generated_secret"
    BETTER_AUTH_URL="http://localhost:3000"

    # Social Auth (Google)
    GOOGLE_CLIENT_ID="..."
    GOOGLE_CLIENT_SECRET="..."

    # Real-time (Pusher Channels)
    PUSHER_APP_ID="..."
    PUSHER_KEY="..."
    PUSHER_SECRET="..."
    PUSHER_CLUSTER="..."
    NEXT_PUBLIC_PUSHER_KEY="..."
    NEXT_PUBLIC_PUSHER_CLUSTER="..."
    ```

4.  **Database Migration**

    Push the schema to your database:

    ```bash
    bunx prisma db push
    ```

    (Optional) Seed the database with default games:

    ```bash
    bunx prisma db seed
    ```

5.  **Run Development Server**

    ```bash
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🧪 Testing

This project uses **Vitest** for testing.

```bash
# Run tests
bun run test

# Watch mode
bun run test --watch
```

## 🤝 Contributing

Contributions are welcome!

- **Submit Games**: Use the "Suggest a Game" feature in the app.
- **Code**: Fork the repo and submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
