# JWT Auth System with Google OAuth

A Node.js + Express + MongoDB authentication system supporting:
- Email/password registration & login (JWT)
- Google OAuth 2.0 login
- Access token + refresh token pattern
- Secure httpOnly cookies

---

## 📁 Folder Structure

```
jwt-auth-google/
├── src/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── passport.js         # Google OAuth strategy
│   ├── controllers/
│   │   ├── user.controller.js  # Register, login, logout, refresh
│   │   └── google.controller.js# Google OAuth callback handler
│   ├── middlewares/
│   │   └── auth.middleware.js  # JWT Bearer token verifier
│   ├── models/
│   │   └── user.model.js       # Mongoose User schema
│   ├── routes/
│   │   └── user.routes.js      # All /api/users/* routes
│   ├── utils/
│   │   └── asyncHandler.js     # Async error wrapper
│   ├── app.js                  # Express app setup
│   └── index.js                # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Setup Guide

### Step 1 — Clone & install dependencies

```bash
npm install
```

### Step 2 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values (see below for how to get Google credentials).

### Step 3 — Get Google OAuth credentials

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Select **Web application**
6. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/users/auth/google/callback
   ```
7. Click **Create** — copy the **Client ID** and **Client Secret**
8. Paste them into your `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

> ⚠️ Also enable the **Google+ API** or **People API** in your project under
> **APIs & Services → Library**.

### Step 4 — Start the server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:3000`

---

## 📡 API Reference

### Register
```
POST /api/users/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "secret123"
}
```

### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```
Returns `accessToken` in the JSON body. Sets `refreshToken` in an httpOnly cookie.

### Logout
```
POST /api/users/logout
Authorization: Bearer <accessToken>
```

### Refresh Access Token
```
POST /api/users/refresh-token
Cookie: refreshToken=<token>    ← sent automatically by browser
```
Or send in the body:
```json
{ "refreshToken": "..." }
```

### Get Current User
```
GET /api/users/me
Authorization: Bearer <accessToken>
```

### Google Login
```
GET /api/users/auth/google
```
Open this URL in the browser. The user is redirected to Google, consents,
and lands back at `/api/users/auth/google/callback`.

On success, the user is redirected to:
```
http://localhost:5173/auth/success?token=<accessToken>
```
The `refreshToken` is set as an httpOnly cookie.

On failure:
```
http://localhost:5173/auth/failure
```

---

## 🔐 How the Token Flow Works

```
┌─────────────────────────────────────────────────────────────────┐
│  Standard Login                                                  │
│                                                                  │
│  POST /login ──→ validate credentials                           │
│               ──→ generate accessToken (15min) + refreshToken   │
│               ──→ accessToken in JSON body                       │
│               ──→ refreshToken in httpOnly cookie                │
│                                                                  │
│  Frontend stores accessToken in memory (NOT localStorage)        │
│  Sends it as: Authorization: Bearer <token>                      │
│                                                                  │
│  When accessToken expires → POST /refresh-token                  │
│  (cookie is sent automatically) → get new accessToken           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Google OAuth Login                                              │
│                                                                  │
│  User clicks "Login with Google"                                 │
│  Frontend redirects to GET /api/users/auth/google                │
│  ──→ Google login screen                                         │
│  ──→ Google redirects to /auth/google/callback                   │
│  ──→ Passport finds/creates user in MongoDB                      │
│  ──→ Generate accessToken + refreshToken                         │
│  ──→ Redirect to frontend with ?token=<accessToken>              │
│  ──→ Frontend reads token from URL, stores in memory             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Key Design Decisions

| Decision | Why |
|----------|-----|
| `password` is optional in the schema | Google users are created without one |
| Google users can't log in with password | Clear error message guides them to Google |
| Existing email + Google login → accounts are linked | No duplicate accounts |
| `session: false` on the OAuth callback | We use stateless JWTs, not sessions |
| Short session (1min) for OAuth handshake | Sessions are only needed for the OAuth round-trip |
| `refreshToken` in httpOnly cookie | XSS-resistant; not readable by JavaScript |
| `accessToken` in response body | Frontend controls its lifecycle in memory |

---

## 🛡️ Security Notes

- Never commit your `.env` file — it's in `.gitignore`
- Use strong random strings for `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `SESSION_SECRET`
- In production set `NODE_ENV=production` for secure cookie flags
- Rotate secrets if compromised — all tokens become invalid automatically
