/**
 * OKLCH palette engine — "a grammar, not a dictionary".
 *
 * The ENTIRE token set is DERIVED from three inputs: a neutral seed (hue +
 * base chroma), an accent hue, and a contrast value. Those inputs are NOT
 * declared here — they live in DESIGN.md's `palette` block, which
 * scripts/generate-tokens.ts reads. This file is the grammar, not the values.
 * Light and dark both fall out of the same math — you don't look a value up,
 * you derive it.
 *
 * The maths (per the Lovable writeup):
 *  - Lightness across a ramp is a QUADRATIC in the ramp position.
 *  - Chroma is a SKEWED GAUSSIAN (separate left/right sigma) that peaks
 *    asymmetrically, because saturation doesn't peak politely in the middle.
 *  - Each hue gets its OWN curve: a Helmholtz–Kohlrausch nudge drops lightness
 *    in proportion to chroma, so saturated hues don't read as "lighter".
 *  - Surfaces carry depth through lightness (closer = lighter), same direction
 *    in both themes. In dark mode chroma is held at ZERO below L15 and eased in
 *    above, so mid-darks don't go yellow.
 *  - Intents share one base lightness, so white/dark labels clear WCAG on every
 *    intent at once. The label colour itself is DERIVED from the fill lightness.
 */

export type PaletteConfig = {
  /** hue for surfaces & neutrals — a whisper of warmth, not a warm gray */
  neutralHue: number
  /** base chroma for neutrals (tiny) */
  neutralChroma: number
  /** the accent / primary hue */
  accentHue: number
  /** 0..1, 0.5 = default. Higher = more separation between fg and surfaces. */
  contrast: number
}

type LC = { L: number; C: number }
type Tokens = Record<string, string>

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))
const round = (x: number, n = 4) => {
  const p = 10 ** n
  return Math.round(x * p) / p
}

// --- lightness: a quadratic through the ramp position p in [0,1] ------------
// Fit through (0 → 0.985 lightest), (0.5 → 0.585 base), (1 → 0.205 darkest).
const L_A = 0.04
const L_B = -0.82
const L_C0 = 0.985
function lightnessAt(p: number): number {
  return L_A * p * p + L_B * p + L_C0
}

// --- chroma: a skewed gaussian, peaks off-centre with asymmetric sigmas -----
const C_CENTER = 0.6 // peak sits past the middle, around the 550–650 stops
const C_SIGMA_L = 0.35 // falls off slowly toward the light end
const C_SIGMA_R = 0.25 // falls off faster toward the dark end
function chromaAt(p: number, peak: number): number {
  const sigma = p < C_CENTER ? C_SIGMA_L : C_SIGMA_R
  const z = (p - C_CENTER) / sigma
  return peak * Math.exp(-0.5 * z * z)
}

// --- peak chroma per hue (approx in-gamut sRGB ceiling at mid lightness) ----
// Saturation does not peak equally across hues — blue & purple reach further
// than amber & cyan — so each hue is given its own ceiling.
const CHROMA_TABLE: [number, number][] = [
  [0, 0.18],
  [25, 0.175],
  [55, 0.155],
  [75, 0.145],
  [110, 0.155],
  [150, 0.155],
  [195, 0.125],
  [230, 0.15],
  [255, 0.165],
  [285, 0.19],
  [300, 0.205],
  [330, 0.2],
  [360, 0.18],
]
function peakChromaForHue(hue: number): number {
  const h = ((hue % 360) + 360) % 360
  let lo = CHROMA_TABLE[0]
  let hi = CHROMA_TABLE[CHROMA_TABLE.length - 1]
  for (let i = 0; i < CHROMA_TABLE.length - 1; i++) {
    if (h >= CHROMA_TABLE[i][0] && h <= CHROMA_TABLE[i + 1][0]) {
      lo = CHROMA_TABLE[i]
      hi = CHROMA_TABLE[i + 1]
      break
    }
  }
  const t = (h - lo[0]) / Math.max(1e-6, hi[0] - lo[0])
  return lo[1] + t * (hi[1] - lo[1])
}

// Helmholtz–Kohlrausch nudge: saturated colours read lighter, so drop L a
// touch in proportion to chroma. THIS is what makes each hue's curve its own.
const HK = 0.1

/** Sample a hue's ramp at fractional position p (0 = lightest, 1 = darkest). */
function sample(hue: number, p: number): LC {
  const peak = peakChromaForHue(hue)
  const C = chromaAt(p, peak)
  const L = lightnessAt(p) - HK * C
  return { L: clamp(L, 0, 1), C: clamp(C, 0, 0.4) }
}

/** Neutral chroma: zero below L15, eased in above so dark surfaces aren't dead. */
function neutralChromaFor(L: number, base: number): number {
  if (L < 0.15) return 0
  return Math.min(base, base * ((L - 0.15) / 0.1))
}

const fmt = (L: number, C: number, H: number, a?: number) =>
  a == null
    ? `oklch(${round(L)} ${round(C)} ${round(H, 2)})`
    : `oklch(${round(L)} ${round(C)} ${round(H, 2)} / ${round(a, 3)})`

// fractional ramp positions for the tokens we actually ship
const P = {
  fillLight: 0.5, // base intent fill (L ≈ 0.585)
  fillDark: 0.455, // a touch lighter so it still pops on dark surfaces
  softBgLight: 0.06,
  softBgDark: 0.86,
  softFgLight: 0.66,
  softFgDark: 0.24,
}

type Intent = { name: string; hue: number }
function intents(cfg: PaletteConfig): Intent[] {
  return [
    { name: "primary", hue: cfg.accentHue },
    { name: "destructive", hue: 25 },
    { name: "success", hue: 150 },
    { name: "warning", hue: 75 },
  ]
}

function buildIntents(cfg: PaletteConfig, mode: "light" | "dark", t: Tokens) {
  for (const { name, hue } of intents(cfg)) {
    if (mode === "light") {
      const fill = sample(hue, P.fillLight)
      const soft = sample(hue, P.softBgLight)
      const softFg = sample(hue, P.softFgLight)
      t[name] = fmt(fill.L, fill.C, hue)
      // label colour DERIVED from fill lightness: dark fill → white label
      t[`${name}-foreground`] =
        fill.L < 0.6 ? fmt(1, 0, 0) : fmt(0.16, Math.min(0.03, fill.C * 0.15), hue)
      t[`${name}-soft`] = fmt(soft.L, soft.C, hue)
      t[`${name}-soft-foreground`] = fmt(softFg.L, softFg.C, hue)
    } else {
      const fill = sample(hue, P.fillDark)
      const soft = sample(hue, P.softBgDark)
      const softFg = sample(hue, P.softFgDark)
      t[name] = fmt(fill.L, fill.C, hue)
      t[`${name}-foreground`] =
        fill.L < 0.6 ? fmt(1, 0, 0) : fmt(0.16, Math.min(0.03, fill.C * 0.15), hue)
      t[`${name}-soft`] = fmt(soft.L, soft.C * 0.6, hue)
      t[`${name}-soft-foreground`] = fmt(softFg.L, softFg.C, hue)
    }
  }
}

function buildTheme(cfg: PaletteConfig, mode: "light" | "dark"): Tokens {
  const t: Tokens = {}
  const h = cfg.neutralHue
  const d = cfg.contrast - 0.5 // contrast delta around the 0.5 default
  const nfmt = (L: number) => fmt(L, neutralChromaFor(L, cfg.neutralChroma), h)

  buildIntents(cfg, mode, t)
  const primaryFill = t["primary"]
  const primaryFg = t["primary-foreground"]

  if (mode === "light") {
    // surfaces — closer to you = lighter
    t["background"] = nfmt(0.969)
    t["card"] = nfmt(0.988)
    t["popover"] = fmt(1, 0, 0)
    // text
    t["foreground"] = fmt(0.255 - d * 0.18, 0.012, h)
    t["card-foreground"] = t["foreground"]
    t["popover-foreground"] = t["foreground"]
    t["muted-foreground"] = fmt(0.545 - d * 0.12, 0.012, h)
    // neutral fills
    t["secondary"] = nfmt(0.955)
    t["secondary-foreground"] = t["foreground"]
    t["muted"] = nfmt(0.955)
    t["accent"] = nfmt(0.95)
    t["accent-foreground"] = t["foreground"]
    // lines (drawn as box-shadow rings, but kept as tokens too)
    t["border"] = fmt(0.255, 0.01, h, clamp(0.1 + d * 0.06, 0.04, 0.3))
    t["input"] = fmt(0.255, 0.01, h, clamp(0.12 + d * 0.06, 0.05, 0.32))
  } else {
    t["background"] = fmt(0.155, 0, 0) // zero chroma below L15
    t["card"] = nfmt(0.198)
    t["popover"] = nfmt(0.235)
    t["foreground"] = fmt(0.955 + d * 0.02, 0.004, h)
    t["card-foreground"] = t["foreground"]
    t["popover-foreground"] = t["foreground"]
    t["muted-foreground"] = fmt(0.675 + d * 0.08, 0.008, h)
    t["secondary"] = nfmt(0.235)
    t["secondary-foreground"] = t["foreground"]
    t["muted"] = nfmt(0.235)
    t["accent"] = nfmt(0.268)
    t["accent-foreground"] = t["foreground"]
    t["border"] = fmt(1, 0, 0, clamp(0.09 + d * 0.05, 0.04, 0.3))
    t["input"] = fmt(1, 0, 0, clamp(0.12 + d * 0.05, 0.05, 0.32))
  }

  // ring follows the accent
  t["ring"] = primaryFill

  // charts: the intent hues + a purple, all on the same lightness
  t["chart-1"] = t["primary"]
  t["chart-2"] = t["success"]
  t["chart-3"] = t["warning"]
  t["chart-4"] = t["destructive"]
  t["chart-5"] = fmt(
    sample(300, mode === "light" ? P.fillLight : P.fillDark).L,
    sample(300, mode === "light" ? P.fillLight : P.fillDark).C,
    300
  )

  // the sidebar is a FLOATING panel — closer to you than the page, so it sits
  // at the raised (card) elevation: lighter than --background, never equal to it.
  t["sidebar"] = mode === "light" ? nfmt(0.988) : nfmt(0.198)
  t["sidebar-foreground"] = t["foreground"]
  t["sidebar-primary"] = primaryFill
  t["sidebar-primary-foreground"] = primaryFg
  t["sidebar-accent"] = t["accent"]
  t["sidebar-accent-foreground"] = t["foreground"]
  t["sidebar-border"] = t["border"]
  t["sidebar-ring"] = primaryFill

  t["radius"] = "0.45rem"

  return t
}

export function generateThemes(cfg: PaletteConfig) {
  return { light: buildTheme(cfg, "light"), dark: buildTheme(cfg, "dark") }
}

function block(selector: string, tokens: Tokens): string {
  const lines = Object.entries(tokens).map(([k, v]) => `    --${k}: ${v};`)
  return `${selector} {\n${lines.join("\n")}\n}`
}

/** Render the full :root + .dark CSS for a config. */
export function toCss(cfg: PaletteConfig): string {
  const { light, dark } = generateThemes(cfg)
  return [
    "/* ----------------------------------------------------------------------",
    "   GENERATED FILE — do not edit by hand.",
    "   Produced by lib/palette/engine.ts. Regenerate with:  pnpm gen:tokens",
    `   inputs: neutralHue=${cfg.neutralHue} accentHue=${cfg.accentHue} contrast=${cfg.contrast}`,
    "   ---------------------------------------------------------------------- */",
    "",
    block(":root", light),
    "",
    block(".dark", dark),
    "",
  ].join("\n")
}
