# Killshill — KOL Audit Leaderboard

A KOL (Key Opinion Leader) performance leaderboard that ranks crypto signal callers by accuracy, volume, and realized ROI. Built as part of the Killshill Frontend Intern assignment.

**Live:** [koldashbaord.vercel.app](https://koldashbaord.vercel.app/)

---

## Features

### Core

- **Leaderboard table** — Rank, avatar + handle, accuracy %, total signals, average ROI %, last signal timestamp, and action column
- **Sorting** — Clickable column headers to sort by Accuracy, Total Signals, and Average ROI (ascending/descending toggle)
- **Search** — Filter KOLs by handle in real time
- **Minimum accuracy filter** — Dropdown presets (50 / 60 / 70 / 80 / 90 %)
- **Signal detail drawer** — Click any KOL row to open a side sheet showing their latest 10 signals with symbol, direction (BUY/SELL), entry price, target price, stop loss, status badge (OPEN, TARGET_HIT, STOPLOSS_HIT, EXPIRED), and ROI %
- **Refresh** — Re-fetches data from the API with a loading spinner; toast notification on success or failure

### State Handling

- **Loading** — Skeleton rows during initial data fetch
- **Refreshing** — Stale data stays visible at reduced opacity while new data loads
- **Empty** — Friendly message with a "Clear Filters" action when no KOLs match
- **Error** — Descriptive message with a "Try again" button on API failure

### Responsive Design

- **Desktop** (1440px) — Full table layout
- **Tablet** (768px) — Condensed table
- **Mobile** (375px) — Table rows transform into dedicated card components instead of hiding columns

### Stretch Goals Implemented

1. **Sparkline column** — Each KOL's last 10 ROI values rendered as a tiny SVG line chart with area fill, colored by net trend direction
2. **URL-synced filters** — Search, minimum accuracy, and sort state persist in the URL query string for shareability; two-way sync between store and URL

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Table | TanStack Table v8 |
| State | Zustand v5 |
| Drawer | shadcn Sheet |
| Toasts | Sonner |
| Icons | Lucide React |
| Animations | Motion (Framer Motion) |

---

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd <repo-name>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── layout.tsx          # Root layout — fonts, theme, nav, toaster
├── page.tsx            # Home page — renders the leaderboard
├── globals.css         # Design tokens, glassmorphism, grid backdrop
├── analytics/          # Analytics page
└── signals/            # Signals feed page

components/
├── leaderboard.tsx         # Main orchestrator — data loading, filtering, layout
├── leaderboard-header.tsx  # Title, KOL count, last updated, refresh button
├── leaderboard-toolbar.tsx # Search input, accuracy filter dropdown, clear button
├── leaderboard-table.tsx   # Desktop table with TanStack Table, keyboard nav
├── leaderboard-cards.tsx   # Mobile card layout (responsive alternative to table)
├── leaderboard-columns.tsx # Column definitions for TanStack Table
├── leaderboard-states.tsx  # Skeleton, empty, and error state components
├── signal-drawer.tsx       # Side sheet with KOL summary + signal cards
├── signal-badges.tsx       # Direction, status, and ROI badges
├── sparkline.tsx           # Dependency-free SVG sparkline
├── sort-header.tsx         # Sortable column header with toggle indicator
├── kol-identity.tsx        # Avatar + handle + verified badge
├── accuracy-meter.tsx      # Visual accuracy percentage display
├── stats-band.tsx          # Summary statistics strip
├── top-nav.tsx             # Navigation bar
├── use-url-sync.ts         # Two-way URL ↔ store sync hook
├── use-async.ts            # Async data fetching hook
├── motion.tsx              # Shared animation variants
└── ui/                     # shadcn/ui primitives

lib/
├── store.ts        # Zustand store — rows, filters, sort, load/refresh
├── data.ts         # API fetch + join KOLs ↔ signals
├── types.ts        # TypeScript interfaces (Kol, Signal, KolRow, SignalRow)
├── leaderboard.ts  # Filter and sort logic
├── url.ts          # URL query string serialization/deserialization
├── format.ts       # Number, date, and percentage formatters
├── analytics.ts    # Analytics data aggregation
└── utils.ts        # cn() utility
```

---

## Design Decisions

- **Dark mode only** — Matches the killshill.ai aesthetic. A charcoal surface with oklch color tokens tuned for WCAG AA contrast on all text and data
- **Cards on mobile, not a truncated table** — Hiding columns degrades the data story. Each mobile card shows the same information hierarchy as a desktop row
- **Zustand over React Context** — Leaner API, no provider nesting, and selectors prevent unnecessary re-renders across the leaderboard
- **Custom SVG sparkline** — Avoided pulling in Recharts for a single tiny chart. The implementation is ~80 lines, zero dependencies, and renders a line + area + endpoint dot
- **Optimistic refresh** — On refresh, stale data stays visible at reduced opacity while the new fetch runs. If it fails, a toast surfaces the error without wiping the screen

---

## AI Usage

- **Generated with AI:** Initial scaffolding of shadcn/ui component wiring and Zustand store boilerplate
- **Written manually:** The sparkline SVG rendering logic, the URL sync hook, and all responsive card layouts
- **Why:** AI accelerated repetitive setup (installing shadcn primitives, writing TanStack column definitions), freeing time for the custom visual components and state management that define the product feel

---

## What I'd Improve With 4 More Hours

- **Live Binance prices** — For OPEN signals, fetch real-time BTCUSDT / ETHUSDT prices from the Binance API to calculate live ROI instead of using the static `current_price` from the mock data
- **Pagination or virtualization** — The current list renders all KOLs at once; with hundreds of rows, a virtualized table (TanStack Virtual) would improve scroll performance
- **E2E tests** — Add Playwright tests covering the critical path: load → search → filter → open drawer → verify signal data
