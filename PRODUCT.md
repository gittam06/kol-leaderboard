# Product

## Register

product

## Users

Crypto traders and researchers evaluating "key opinion leaders" (KOLs) before copying their calls. They arrive skeptical, scanning for who is actually accurate versus loud. Context: focused desk session on desktop, or a quick check on mobile between trades. The job: rank, filter, and vet signal-callers fast, then drill into a specific caller's recent trades to judge quality.

## Product Purpose

A KOL performance leaderboard. It fetches live KOL and signal data, ranks callers by accuracy / volume / ROI, and lets a user sort, search, filter, and open any caller to inspect their latest trading signals (entry, target, stop, status, ROI). Success = a trader trusts the numbers at a glance and can defend "why this KOL" in ten seconds.

## Brand Personality

Sleek crypto SaaS. Three words: precise, confident, calm. Numbers are the hero; chrome stays out of the way. Green/red carry signal meaning only, never decoration. Voice in copy is plain and direct — no hype, no emoji, no "🚀 to the moon." Matches the killshill.ai register: deep charcoal surfaces, one saturated accent, generous spacing, data-first.

## Anti-references

- Neon degen / memecoin aesthetic (glow, rainbow gradients, aggressive). Signal colors must stay disciplined.
- Bloomberg-terminal density — this is a product leaderboard, not a trading terminal; keep breathing room.
- Generic shadcn-default dashboard with no identity (flat gray cards, zinc everything, no accent commitment).
- Gradient text, glassmorphism-by-default, side-stripe accent borders.

## Design Principles

1. **Numbers are the interface.** Tabular numerics, aligned decimals, color that means gain/loss and nothing else.
2. **Every state is designed.** Loading (skeleton), refreshing (spinner), empty (clear-filters CTA), error (retry), and zero-signal KOLs all get first-class treatment — not afterthoughts.
3. **Responsive means re-thought, not hidden.** Mobile rows become genuine cards, not a table with columns amputated.
4. **Trust through legibility.** Contrast passes WCAG AA; a skeptical user should never squint at the data they're judging.
5. **Motion serves comprehension.** Drawer slide, row hover, refresh spinner — each confirms an action. No decorative animation.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Dark theme only, but body/numeric text must clear 4.5:1 on charcoal surfaces; signal green/red chosen for sufficient contrast and paired with text labels (BUY/SELL, status names) so meaning never rests on hue alone. Full keyboard path: row focus, Enter to open drawer, Esc to close. Respect `prefers-reduced-motion` (crossfade/instant instead of slide).
