# The Ghat Oracle

A playful, single-screen fortune toy with a rotating pool of comic-guide poses, her mischievous parrot Mithu, a continuous Kashi-inspired journey, a local-only palm scan, and an automatic tarot draw.

## Run locally

```bash
bun install
bun run dev
```

Use `bun run build` for a production build and `bun run lint` for code checks.

## Experience flow

```text
invitation -> name + date of birth -> automatic palm photo -> fake scan -> shuffled random tarot draw -> 1-minute reading -> reset
```

Camera frames stay only in in-memory app state. They are never uploaded or persisted and are cleared when the reading resets. If camera permission is unavailable, the experience continues with a demo scan.

The vertical world moves from a Banarasi craft-and-food market to balcony-lined galis, then down to the river ghats. The guide changes to a different still pose at every step; only her comic bubble animates.

The fixed, no-scroll composition has dedicated phone, desktop, short-wide, 1440p, ultrawide, and 4K layout tiers instead of relying on a global zoom.

Each stage chooses one playful copy variant when it mounts and keeps it stable while the user interacts. Every tarot card owns exactly three concrete outcomes, so the revealed prediction always belongs to the automatically selected card.

## Project map

- `src/app` - app shell and stage routing
- `src/components/stages` - one small component per experience step
- `src/components/three` - continuous market, street, ghat, and water world
- `src/components/oracle` and `src/components/date` - comic guide and custom DOB control
- `src/components/camera` and `src/hooks` - local camera analysis and capture
- `src/store` - guarded Zustand experience state
- `src/utils` - deterministic variation, fortune, date, and stage-art selection
- `src/data` - tarot, scan captions, dialogue, and fortune content
- `src/styles` - shared tokens and feature-level visual styles
