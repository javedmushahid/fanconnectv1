# FanConnect — Architecture

## Overview

FanConnect is a **creator-subscriber platform** where fans can follow creators, subscribe to premium tiers, view exclusive content, watch live streams, exchange messages, and browse stories. Think of it as a Patreon-meets-Instagram experience.

The frontend is a **Next.js 16 App Router** application written in **TypeScript** with **React 19**. It is designed as a **Progressive Web App (PWA)** with offline support, installability, and mobile-first responsive layouts.

The backend is a separate service (not in this repo) exposing a REST API at `/api/*` and a WebSocket server for real-time messaging.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS 4, CSS variables |
| Component Library | shadcn/ui (New York style, Radix primitives) |
| Icons | Lucide React, React Icons |
| State Management | Zustand 5 |
| HTTP Client | Axios |
| Real-time | Socket.IO Client |
| Forms | React Hook Form + Zod validation |
| Charts | Recharts |
| Theming | next-themes (system / light / dark) |
| Notifications | Sonner (toast) |
| PWA | Custom service worker (`public/sw.js`) + web manifest |

---

## Directory Structure

```
app/                        # Next.js App Router pages & layouts
├── (auth)/                 # Auth route group (login, signup, forgot/reset password)
│   └── layout.tsx          # Split-screen auth layout
├── (main)/                 # Authenticated user route group
│   ├── layout.tsx          # Navbar + sidebar + mobile nav shell
│   ├── feed/               # Main content feed
│   ├── explore/            # Discover creators
│   ├── stories/            # Instagram-style stories (view & create)
│   ├── streaming/          # Live streaming (viewer, creator dashboard)
│   ├── messages/           # Real-time direct messaging
│   ├── subscriptions/      # User's active subscriptions
│   ├── subscribe/[creatorId]/ # Subscribe to a creator
│   ├── checkout/           # Stripe-like checkout flow
│   ├── analytics/          # Creator analytics (overview, audience, content, revenue)
│   ├── settings/           # User settings
│   ├── saved/              # Saved/bookmarked posts
│   └── [username]/         # Public profile page
├── creator/                # Creator management portal
│   ├── layout.tsx          # Creator nav (dashboard, upload, earnings, subscribers)
│   ├── dashboard/
│   ├── upload/
│   ├── earnings/
│   └── subscribers/
├── layout.tsx              # Root layout (ThemeProvider, AuthProvider, Toaster, SW)
├── page.tsx                # Root page — redirects to /feed
└── globals.css             # Tailwind + CSS variable theme tokens

components/
├── ui/                     # shadcn/ui primitives (button, dialog, card, tabs, etc.)
├── layout/                 # Shell components (navbar, sidebar, mobile-nav, FAB, scroll-to-top)
├── feed/                   # Post cards, infinite scroll, comments, share modal, lightbox
├── stories/                # Story rings, story viewer, story creator
├── streaming/              # Video player, stream chat, super chat, go-live modal
├── subscription/           # Subscription tiers, checkout, success/cancel pages
├── creator/                # Onboarding wizard, earnings chart, subscriber chart
├── analytics/              # Overview, audience, content, revenue dashboards
├── profile/                # User profile, edit modal, highlights
├── auth/                   # Protected route wrapper, social login button
├── providers/              # AuthProvider (initializes auth on app load)
├── errors/                 # Error boundary, 500, maintenance, offline pages
├── pwa/                    # Install prompt, service worker registration
├── seo/                    # Meta tag helpers
└── theme-provider.tsx      # next-themes wrapper

lib/
├── api/
│   ├── client.ts           # Axios instance with automatic 401 → token refresh interceptor
│   ├── auth.service.ts     # Standalone auth service (legacy, used alongside endpoints/)
│   └── endpoints/
│       ├── auth.ts         # Login, register, verify OTP, refresh, logout, forgot-password
│       ├── follows.ts      # Follow/unfollow, get followers/following
│       └── messaging.ts    # Conversations, messages, mark-as-read
├── auth/
│   └── token-manager.ts    # Background token refresh on an interval
├── messaging/
│   └── socket-manager.ts   # Singleton Socket.IO connection manager
├── utils/
│   └── storage.ts          # Cookie helpers for clearing tokens
├── store.ts                # Legacy simple auth store
├── utils.ts                # General utilities (cn, etc.)
└── validations.ts          # Zod schemas

store/
└── auth.store.ts           # Primary Zustand auth store (user, login, register, logout)

hooks/
├── use-auth.ts             # Convenience hook over auth store + routing + token manager
└── use-messaging.ts        # Full messaging hook (socket, conversations, typing, online status)

types/
├── auth.types.ts           # User, credentials, API responses, store types
└── index.ts                # Shared domain types (Post, Subscription, Comment, Message)

contexts/
└── auth-context.tsx        # (Legacy) React context-based auth — replaced by Zustand store

middleware.ts               # Next.js edge middleware — route protection via refreshToken cookie
```

---

## Key Architectural Decisions

### 1. Authentication

- **Cookie-based JWT auth.** The backend sets `httpOnly` cookies (`accessToken`, `refreshToken`). The frontend never reads tokens directly — it sends `withCredentials: true` on every request and lets the browser handle cookies.
- **Axios interceptor** in `lib/api/client.ts` catches `401` responses, attempts a silent token refresh via `POST /auth/refresh-token`, queues concurrent requests during the refresh, and retries them once the new token is set.
- **TokenManager** (`lib/auth/token-manager.ts`) runs a background `setInterval` to proactively refresh the access token every ~12 minutes, preventing expiry during active sessions.
- **AuthProvider** (`components/providers/auth-provider.tsx`) runs on app mount: fetches the current user via `GET /auth/me`; if that 401s, it tries a refresh then retries. This bootstraps the Zustand auth store.
- **Middleware** (`middleware.ts`) runs at the edge and checks for the `refreshToken` cookie to gate protected routes and redirect authenticated users away from auth pages.

### 2. State Management

- **Zustand** is the primary state library. The auth store (`store/auth.store.ts`) holds `user`, `isLoading`, `isInitialized`, and `error`, plus action methods for login/register/logout.
- Component-level state is managed with React hooks (`useState`, `useEffect`, `useCallback`).
- No global store exists for posts, subscriptions, or other domain data — those are fetched per-page.

### 3. Routing & Layouts (App Router)

- **Route groups** `(auth)` and `(main)` separate authenticated vs. unauthenticated shells without affecting URL paths.
- The `(main)` layout provides the persistent navbar, sidebar, mobile bottom nav, FAB, and scroll-to-top button.
- The `(auth)` layout provides a split-screen design with a form on the left and a branded illustration on the right.
- The `creator/` route group (outside the main group) has its own layout with creator-specific navigation tabs.
- Analytics uses a nested layout with tab navigation (overview, audience, content, revenue).

### 4. Real-time Messaging

- **Socket.IO** client (`lib/messaging/socket-manager.ts`) is a singleton that connects with cookie credentials.
- Events: `message:new`, `message:status`, `typing:start/stop`, `user:online/offline`.
- The `useMessaging` hook (`hooks/use-messaging.ts`) wires up the socket, manages message state, handles typing indicators, tracks online users, and loads followers/following lists.

### 5. API Layer

- All HTTP calls go through a single Axios instance (`lib/api/client.ts`) pointed at `NEXT_PUBLIC_API_URL`.
- Endpoint modules under `lib/api/endpoints/` group related calls (auth, follows, messaging) and handle response unwrapping.
- API responses follow a `{ success, message, data }` envelope pattern.

### 6. UI & Styling

- **shadcn/ui** components (configured in `components.json`) provide accessible, composable primitives built on Radix UI.
- **Tailwind CSS 4** with CSS variables for theming. Dark mode is supported via `next-themes`.
- Mobile-first design with a bottom navigation bar for small screens and a sidebar for desktop.

### 7. PWA

- A web app manifest (`public/manifest.json`) defines the app name, icons, shortcuts, and display mode.
- A service worker (`public/sw.js`) is registered via `components/pwa/service-worker-register.tsx`.
- An install prompt component (`components/pwa/install-prompt.tsx`) nudges users to add the app to their home screen.
- Offline and maintenance error pages are provided (`components/errors/`).

---

## Data Flow Summary

```
User Action
  → React Component
    → Custom Hook (useAuth / useMessaging)
      → Zustand Store (state update) + API Endpoint module
        → Axios Client (with cookie auth & auto-refresh interceptor)
          → Backend REST API / Socket.IO Server
```

---

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the REST API (default: `http://localhost:3001/api`) |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket server URL (default: `http://localhost:3001`) |

---

## Running Locally

```bash
yarn dev          # Start Next.js dev server
yarn build        # Production build
yarn start        # Start production server
yarn lint         # Run ESLint
```
