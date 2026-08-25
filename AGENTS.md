<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# oklch-dashboard

A dense, data-first dashboard — and the working ground where this design
system's principles get set. Every pattern here is meant to be a decision that
holds up under real data, not a demo. If something in the UI can't be justified
from `DESIGN.md`, that's a finding, not a detail.

The maintainer is a UX designer. Usability and craft come first: everything
should exist for a reason and feel effortless.

This file is the single instruction source for every AI tool in this repo.
`CLAUDE.md` imports it; Codex and other agents read it directly. Don't duplicate
its content elsewhere — link to it.

---

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Radix UI ·
class-variance-authority · Recharts · @phosphor-icons/react · next-themes

**Radix comes from the unified `radix-ui` package** — `import { Slot } from "radix-ui"`,
not `@radix-ui/react-slot`. Don't add the scoped per-primitive packages.

---

## Before building anything

Read `DESIGN.md` first. Its YAML front matter is the complete token snapshot —
palette inputs, typography, radius, spacing, layout, elevation, motion, control
sizes, density, and per-component tokens. It answers most questions on its own.

**Colour works differently here than in most projects.** Colours are not listed,
they are *derived*. Four numbers in `DESIGN.md` → `palette` (`neutralHue`,
`neutralChroma`, `accentHue`, `contrast`) feed `lib/palette/engine.ts`, which
generates the entire light + dark token set.

```
Change a colour        →  edit DESIGN.md → palette  →  pnpm gen:tokens
Change any other value →  edit the DESIGN.md YAML block for it
Change the colour MATHS →  edit lib/palette/engine.ts  →  pnpm gen:tokens
```

**Generated — never hand-edit:**

- `app/tokens.css`
- the block between the `>>> GENERATED` / `<<< END GENERATED` markers in `DESIGN.md`

`pnpm gen:tokens:check` exits non-zero when either has drifted. Use it as a
pre-commit or CI step.

---

## Rules that always apply

**Colour**
- **No hardcoded colours.** Token classes (`text-foreground`, `bg-card`) or CSS
  variables (`var(--primary)`). No hex, no `oklch()` literals in components.
- **Intents mark state, not brand.** `destructive` / `success` / `warning` for
  errors, confirmations, cautions. `primary` is the only brand accent.
- **Passive status takes the `-soft` pair**, actions take the solid fill. A status
  badge is information; it doesn't get an action's weight.
- **Chart colour is series identity, not status.** A falling line is not
  `destructive`.

**Type**
- **Two weights only — 400 and 500.** More emphasis means a different colour or a
  different surface, never a heavier or larger font.
- **`metric` (1.25rem) is the ceiling, and it's for numbers.** There is no display
  tier. Don't introduce `text-2xl` or above.
- **Every figure gets `tabular-nums`** — table cells, KPI values, deltas, tooltips.

**Layout & space**
- **No arbitrary Tailwind values** like `p-[13px]` or `text-[10px]`. Use the scale.
- **There is no 12-column grid.** The shell is a fixed sidebar plus a fluid content
  area — no centred `max-w-*` page wrapper. Cards lay out with flex/grid per block.
- **Semantic spacing tokens are layout-level only.** A component's internal
  padding is the component's own concern — never reach for `between-cards` inside
  a component.
- **Wide content scrolls inside its own container.** The page body never scrolls
  sideways. Tables already do this via `ScrollArea`.
- **Step through breakpoints** — never jump from 1 to 3 items per row.

**Surface & depth**
- **Depth is lightness, in both themes.** Closer to the viewer = lighter. The
  ladder is `background` → `card` → `popover`.
- **A surface never sits at the same lightness as its parent.** If it needs to
  separate and can't move, it needs a hairline, not a shadow.
- **Don't add a shadow scale.** `--shadow-soft` confirms a lightness step; it
  never substitutes for one.
- **Nesting radius shrinks** — an inner surface takes a smaller step than its
  container.

**Interaction**
- **One raised button per view.** `variant="default"` (the sheened, inset-ring
  treatment) marks the single primary action. Everything else is flat.
- **`destructive` is tonal, not solid.** A destructive action asks; it doesn't shout.
- **Never remove a focus outline** without a visible replacement. Every
  interactive element shows the `focus-ring` on `:focus-visible`.
- **Motion stays under 250ms.** `ease-linear` for width/position/margin,
  `ease-default` for colour/opacity/transform. Honour `prefers-reduced-motion`.

**Components**
- **Build with `cva` + `cn`**, and give every part a `data-slot`. Match the
  existing components in `components/ui/`.
- **Icons are Phosphor** (`@phosphor-icons/react`) at `size-3` / `size-4` /
  `size-5` inline, larger only for empty states.
- **No emojis** in UI, code, or commits. If it needs a glyph, it's an icon.
- **Every new component goes in the showcase** — add it to
  `components/showcase/slugs.ts` and `components/showcase/registry.tsx`, with a
  preview and at least one labelled example. A component that isn't in the
  showcase isn't finished.

---

## Reading order

`DESIGN.md` covers most of it. Then:

0. **`DESIGN.md`** — the complete token snapshot in YAML, plus the rationale per
   concern. Read this first, always.
1. **`lib/palette/engine.ts`** — how colour is derived. Read before changing any
   colour behaviour; the header comment explains the maths.
2. **`app/globals.css`** — the Tailwind `@theme` mapping (which token becomes
   which utility), the radius multipliers, and the `.btn-raised` / `.btn-sheen`
   shadow stack.
3. **`components/ui/`** — the built vocabulary. Read the nearest existing
   component before writing a new one.
4. **`components/showcase/registry.tsx`** — the live inventory at `/components`.

> The per-concern docs from the `oh.design` foundation (`tokens.md`,
> `typography.md`, `spacing.md`, `radius.md`, `motion.md`, `grid.md`, `icons.md`,
> `grammar-and-style.md`) do not exist in this project yet. Their content
> currently lives inside `DESIGN.md`. Split them out when a section outgrows it —
> and when you do, the split doc documents structure and rationale only. It never
> repeats a value.

---

## When in doubt

If you are unsure which component to use, which pattern fits, or whether
something belongs in the system at all — **ask before writing code.** Don't guess
and don't improvise. This repo is where principles get decided, so a wrong
pattern here propagates.

Two questions worth asking out loud rather than answering silently:

- *Is this a new principle, or an exception?* Exceptions get written down or they
  get removed.
- *Would this survive real data?* Long labels, empty states, twelve rows, zero
  rows, a negative number.

---

## Highlighted text

When the maintainer highlights text in a file using `==like this==`, it is a
personal note with their take or a change they want applied. Read it, update the
file to reflect it, and remove the highlight.

---

## Quick reference

| Category | Where | Key info |
|---|---|---|
| **All token values** | `DESIGN.md` (YAML) | Single source of truth |
| Colour inputs | `DESIGN.md` → `palette` | 4 numbers; everything else derives |
| Colour maths | `lib/palette/engine.ts` | Quadratic L, skewed-gaussian C, per-hue caps |
| Generated CSS | `app/tokens.css` | Never hand-edit — `pnpm gen:tokens` |
| Drift check | `pnpm gen:tokens:check` | Non-zero exit on drift |
| Utility mapping | `app/globals.css` | `@theme inline`, radius ladder, shadow stack |
| Type | `DESIGN.md` → `typography` | 6 roles, 2 weights, numbers are the largest type |
| Layout | `DESIGN.md` → `layout` | Sidebar shell, fluid content, no page grid |
| Density | `DESIGN.md` → `density` | Table rows, cell padding, badge height |
| Controls | `DESIGN.md` → `control-sizes` | xs 24 / sm 32 / default 36 / lg 40 |
| Motion | `DESIGN.md` → `motion` | 100ms / 200ms, 250ms ceiling |
| Component inventory | `/components` route | `components/showcase/registry.tsx` |
