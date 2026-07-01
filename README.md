# Killshill KOL Audit Page

Leaderboard that ranks crypto signal callers (KOLs) by how accurate they actually are. You can sort, search, filter by accuracy, and click into any caller to see their last 10 trades with entry/target/stop-loss prices and outcomes.

Built for the Killshill Frontend Intern assignment.

**Live demo:** https://koldashbaord.vercel.app/

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## What's in here

- Sortable leaderboard table (accuracy, signals, ROI) with TanStack Table
- Search by handle + minimum accuracy dropdown filter
- Signal detail drawer (shadcn Sheet) showing latest 10 signals per KOL: symbol, BUY/SELL badge, entry/target/stop-loss prices, status (OPEN, TARGET_HIT, STOPLOSS_HIT, EXPIRED), ROI%
- Skeleton loading state, error state with retry, empty state with clear filters
- Mobile layout uses card components instead of just hiding table columns
- Refresh button that keeps stale data visible while fetching, with sonner toasts
- Dark mode only, matching the killshill.ai look

### Stretch goals I picked

1. **Sparkline column** - tiny SVG chart of the last 10 ROI values per KOL. Built it without Recharts since it's just one small chart, ~80 lines of SVG math.
2. **URL-synced filters** - filter/sort state saves to the query string so you can share a filtered view. Reads from URL on load, writes back on change.

## Stack

Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui + Radix, TanStack Table, Zustand, Sonner, Lucide icons, Motion for animations.

## Project layout

```
app/
  layout.tsx        - root layout, fonts, toaster
  page.tsx          - renders the leaderboard
  globals.css       - color tokens, glass effects

components/
  leaderboard.tsx       - main component, wires everything together
  leaderboard-table.tsx - desktop table with keyboard nav (arrow keys, Enter to open drawer)
  leaderboard-cards.tsx - mobile card layout
  leaderboard-toolbar.tsx - search + accuracy filter
  signal-drawer.tsx     - side panel with signal details
  sparkline.tsx         - custom SVG sparkline
  use-url-sync.ts       - URL <-> store sync hook

lib/
  store.ts    - Zustand store (rows, filters, sort, load/refresh)
  data.ts     - fetches KOL + signal JSON, joins them
  types.ts    - TypeScript interfaces
```

## Design choices

**Why Zustand over Context?** Less boilerplate, no provider nesting, and selectors mean only the components that care about a specific slice re-render. The leaderboard has a lot of moving parts (search, filter, sort, selection, loading state) and Context would've meant either one giant provider or a bunch of small ones.

**Why a custom sparkline instead of Recharts?** The assignment lists Recharts as optional, but pulling in a full charting library for a single 96x32px line felt heavy. The SVG version is straightforward - map data points to coordinates, draw a path, add an area fill and endpoint dot.

**Mobile cards vs hidden columns.** The brief specifically says "transform table rows into cards instead of simply hiding columns." Each card shows rank, identity, accuracy, signals, ROI, last signal time, and the sparkline - same info as the desktop row, just rearranged.

## AI usage

I used AI to speed up the initial wiring - hooking up shadcn components, writing the TanStack Table column definitions, and the Zustand store shape. The sparkline SVG logic, URL sync hook, responsive card layout, and the overall component architecture I wrote myself. AI is good at boilerplate; the parts that define how the product actually feels needed manual work.

## What I'd do with more time

- Hook up the Binance API (`api.binance.com/api/v3/ticker/price`) to show live prices for OPEN signals and calculate real-time ROI
- Add virtualized scrolling with TanStack Virtual if the KOL list grows past a few hundred
- Playwright tests for the main user flow: load -> search -> filter -> open drawer -> check signal data
