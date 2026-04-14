<div align="center">

<img src="https://img.shields.io/badge/VaultBreak-Word%20Decryption%20Game-1a1a2e?style=for-the-badge&logoColor=white" alt="VaultBreak" height="50"/>

**A full-stack word decryption game. Create encrypted puzzles. Challenge others to crack them. Race against time. Claim the leaderboard.**

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com).
[![Inngest](https://img.shields.io/badge/Events-Inngest-E5884F?style=flat-square)](https://inngest.com)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

<br/>

![VaultBreak Preview](https://github.com/Soumyajitttt/VaultBreak/raw/main/vaultbreak-preview.png)

</div>

---

## Overview

VaultBreak is a browser-based word decryption game built on a full-stack JavaScript architecture. Players can author puzzles by submitting a word paired with a custom hint, then challenge others to decrypt it letter by letter under time pressure. A global leaderboard ranks players by score, rewarding both speed and accuracy.

---

## Features

- **Authentication** — Sign in via Google, email, or username through Clerk
- **Puzzle Creation** — Submit any word with a custom hint for other players to solve
- **Letter-by-Letter Play** — Tap A–Z to reveal characters one at a time
- **Pressure System** — Each round enforces a 2-minute countdown and 6 lives
- **Global Leaderboard** — Score-based rankings across all registered players
- **AI Daily Puzzle** — A new puzzle is automatically generated every day at midnight using Gemini 2.5 Flash, with fallback puzzles ensuring the game never breaks
- **Real-time User Sync** — Clerk webhooks propagate user lifecycle events to MongoDB via Inngest

---

## Scoring

```
Score = 1000 (base) + (timeLeft × 5) + (livesLeft × 100)
```

A loss yields a score of **0**. Only wins contribute to the leaderboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS v4 |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB + Mongoose |
| Authentication | Clerk (React SDK + Express SDK) |
| AI Puzzle Generation | Google Gemini 2.5 Flash |
| Event Handling | Inngest (Clerk webhook consumer) |
| Routing | React Router v6 |
| HTTP Client | Axios |

---

## Project Structure

```
vaultbreak/
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js                  # MongoDB connection
│       ├── models/
│       │   ├── user.model.js
│       │   ├── game.model.js
│       │   └── score.model.js
│       ├── controllers/
│       │   ├── game.controller.js
│       │   └── score.controller.js
│       ├── routes/
│       │   ├── game.routes.js
│       │   └── score.routes.js
│       ├── middlewares/
│       │   └── auth.middleware.js     # Clerk JWT verification
│       ├── utils/
│       │   ├── inngest.js             # Clerk → MongoDB user sync
│       │   └── daily.js              # Gemini-powered daily puzzle generator
│       ├── app.js
│       └── index.js
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx
        │   ├── CreateGame.jsx
        │   ├── BrowseGames.jsx
        │   ├── PlayGame.jsx
        │   └── Leaderboard.jsx
        ├── components/
        │   └── Navbar.jsx
        ├── App.jsx
        ├── main.jsx                   # Clerk provider + theme
        └── index.css
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- A [MongoDB Atlas](https://mongodb.com/atlas) cluster
- A [Clerk](https://dashboard.clerk.com) application
- An [Inngest](https://inngest.com) account
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Soumyajitttt/VaultBreak.git
cd VaultBreak
```

---

### 2. Configure Clerk

1. Create a new application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Enable the following sign-in methods: **Email**, **Username**, **Google**
3. Under **Webhooks**, add a new endpoint:
   - URL: `https://your-backend-url/api/inngest`
   - Events to subscribe: `user.created`, `user.updated`, `user.deleted`
4. Copy your **Publishable Key** and **Secret Key** for the steps below

---

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Populate `.env` with the following values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vaultbreak
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx

GEMINI_API_KEY=your_gemini_api_key

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

```bash
npm run dev
```

The server will be available at `http://localhost:5000`.

---

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Populate `.env` with the following values:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/games` | No | List all games (word hidden) |
| `POST` | `/api/games` | Yes | Create a new game |
| `GET` | `/api/games/:id` | Yes | Get a game with its word (for active play) |
| `POST` | `/api/scores` | Yes | Submit a score after completing a round |
| `GET` | `/api/scores/leaderboard` | No | Fetch the global leaderboard |
| `POST` | `/api/inngest` | — | Inngest webhook handler for Clerk user sync |

Authentication is enforced via Clerk JWT verification in `auth.middleware.js`. Protected routes require a valid session token in the `Authorization` header.

---

## Architecture Notes

**AI Daily Puzzle via Gemini** — On server startup, `generateDailyPuzzle()` runs immediately to ensure today's puzzle exists. A scheduler then fires again at the next midnight and repeats every 24 hours via `setInterval`. Each run calls the Gemini 2.5 Flash API with a strict JSON-only prompt, retries up to 3 times on failure, and falls back to a hardcoded set of curated puzzles if all attempts fail — guaranteeing the game always has a daily challenge regardless of API availability. Generated puzzles are stored in MongoDB with `isDaily: true` and a `dailyDate` field, and idempotency is enforced by checking for an existing document before making any API call.

**User Sync via Inngest** — When a user is created, updated, or deleted in Clerk, a webhook fires to `/api/inngest`. Inngest handles the event durably and applies the corresponding operation to the MongoDB `users` collection. This decouples auth state from application state and ensures consistency even under transient failures.

**Game Model** — Words are stored server-side and never exposed in the `GET /api/games` list response. The word is only returned when a verified user fetches a specific game by ID to begin play, preventing client-side cheating.

**Score Formula** — The scoring function rewards both speed and resource conservation. Time remaining is multiplied by 5 and remaining lives by 100, layered on top of a 1000-point base. A failed round always produces 0, keeping the leaderboard meaningful.

---

## Contributing

Pull requests are welcome. For significant changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

This project is open source. See the repository for license details.

---

<div align="center">
Built by <a href="https://github.com/Soumyajitttt">Soumyajit</a>
</div>