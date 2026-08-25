/**
 * Design-system gate.
 *
 * DESIGN.md holds the decisions and AGENTS.md states the rules, but a rule that
 * nothing checks is a rule that decays. This fails the build on the specific
 * violations the system has already been cleaned of, so the cleaning holds:
 * arbitrary font sizes, weights outside the two-weight scale, raw size classes
 * where a role exists, a role paired with a hand-set weight, raw transition
 * durations, and hardcoded colour.
 *
 * Scope is deliberately narrow — typography, motion and colour. It does not
 * police arbitrary values in general, because the shadcn primitives legitimately
 * use a few (ring-[3px], h-[calc(100%-1px)]) and a gate that fails on day one
 * gets switched off.
 *
 * Exceptions are allowed but must be stated. Put
 *   // design-lint-allow: <rule-id> — <reason>
 * on the offending line, or the line above it. A reason is required.
 *
 * Usage:  pnpm lint:design
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, relative, extname } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..")
const ROOTS = ["app", "components", "hooks", "lib"]

/** The eight typography roles. Anything outside these is not a role. */
const ROLES = [
  "page-title",
  "metric",
  "title",
  "body",
  "label-sm",
  "label",
  "caption",
  "code",
] as const

/** The only two weights the system has. */
const WEIGHTS = ["normal", "medium"] as const
const BANNED_WEIGHTS = [
  "thin",
  "extralight",
  "light",
  "semibold",
  "bold",
  "extrabold",
  "black",
] as const

const SIZES = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
] as const

/** A utility token may carry variant prefixes and a trailing `!`. */
const bare = (token: string) => token.replace(/!$/, "").split(":").pop() ?? token

type Rule = {
  id: string
  /** Given the tokens of one class string, return the offending tokens. */
  find: (tokens: string[], raw: string) => string[]
  message: (hit: string) => string
  /** Restrict the rule to certain extensions. Default: all scanned files. */
  ext?: string[]
}

/** A token's variant prefix — "" for an unprefixed one. */
const prefix = (token: string) => {
  const t = token.replace(/!$/, "")
  const i = t.lastIndexOf(":")
  return i === -1 ? "" : t.slice(0, i + 1)
}

const RULES: Rule[] = [
  {
    id: "arbitrary-font-size",
    find: (t) => t.filter((x) => /^text-\[/.test(bare(x)) && !/^text-\[(#|rgb|oklch|hsl)/.test(bare(x))),
    message: (h) =>
      `${h} — arbitrary font size. Use a role: ${ROLES.map((r) => `text-${r}`).join(", ")}.`,
  },
  {
    id: "hardcoded-colour",
    find: (t, raw) => {
      const hits = t.filter((x) => /-\[(#|rgb\(|oklch\(|hsl\()/.test(bare(x)))
      if (/\b(oklch|rgba?|hsla?)\(/.test(raw) && !hits.length) hits.push(raw.slice(0, 40))
      return hits
    },
    message: (h) =>
      `${h} — hardcoded colour. Use a token class or var(--…); colour is derived, see DESIGN.md → palette.`,
    // Components only. lib/palette/engine.ts exists to emit oklch() — it is the
    // source of colour, not a consumer of it.
    ext: [".tsx"],
  },
  {
    id: "weight-outside-scale",
    find: (t) =>
      t.filter((x) => BANNED_WEIGHTS.some((w) => bare(x) === `font-${w}`)),
    message: (h) =>
      `${h} — the system has two weights (400, 500). Emphasis is colour or surface, never a heavier font.`,
  },
  {
    id: "raw-size",
    find: (t) => t.filter((x) => SIZES.some((s) => bare(x) === `text-${s}`)),
    message: (h) =>
      `${h} — raw size class. Name the role instead (a role carries size, leading and weight together).`,
  },
  {
    id: "role-plus-weight",
    find: (t) => {
      const roles = t.filter((x) => ROLES.some((r) => bare(x) === `text-${r}`))
      const weights = t.filter((x) => WEIGHTS.some((w) => bare(x) === `font-${w}`))
      const out: string[] = []
      for (const role of roles) {
        // Same variant prefix = the same element in the same state. A different
        // prefix (data-active:font-medium) is a state change, which is allowed.
        const clash = weights.find((w) => prefix(w) === prefix(role))
        if (clash) out.push(`${role} + ${clash}`)
      }
      return out
    },
    message: (h) =>
      `${h} — the role already sets its weight. Pairing a role with a weight rebuilds it; drop one.`,
  },
  {
    id: "raw-duration",
    find: (t) => t.filter((x) => /^duration-\d+$/.test(bare(x))),
    message: (h) => `${h} — use duration-instant (100ms) or duration-base (200ms).`,
  },
]

const RULE_IDS = new Set(RULES.map((r) => r.id))

// --- collect files ----------------------------------------------------------
function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p, out)
    else if ([".ts", ".tsx"].includes(extname(p))) out.push(p)
  }
  return out
}

/** Blank out comments so prose mentioning a class name isn't a violation. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length))
}

// --- allowlist --------------------------------------------------------------
const ALLOW = /design-lint-allow:\s*([a-z-]+)\s*(?:—|--)\s*(\S.*)$/

type Allowance = { rule: string; reason: string }
function allowancesFor(lines: string[], index: number): Allowance[] {
  const out: Allowance[] = []
  for (const i of [index, index - 1]) {
    const m = lines[i]?.match(ALLOW)
    if (m) out.push({ rule: m[1], reason: m[2].trim() })
  }
  return out
}

// --- run --------------------------------------------------------------------
const files = ROOTS.flatMap((r) => {
  try {
    return walk(join(root, r))
  } catch {
    return []
  }
})

let violations = 0
let allowed = 0
const unknownAllow: string[] = []

for (const file of files) {
  const source = readFileSync(file, "utf8")
  const lines = source.split("\n")
  const scannable = stripComments(source).split("\n")

  for (const [i, line] of scannable.entries()) {
    for (const m of line.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`\n]*)`/g)) {
      const raw = m[1] ?? m[2] ?? m[3] ?? ""
      if (!raw.trim()) continue
      const tokens = raw.split(/\s+/).filter(Boolean)

      for (const rule of RULES) {
        if (rule.ext && !rule.ext.includes(extname(file))) continue
        for (const hit of rule.find(tokens, raw)) {
          const allow = allowancesFor(lines, i).find((a) => a.rule === rule.id)
          if (allow) {
            allowed++
            continue
          }
          violations++
          console.error(
            `${relative(root, file)}:${i + 1}  [${rule.id}]  ${rule.message(hit)}`
          )
        }
      }
    }
  }

  // A marker naming a rule that doesn't exist is a silent hole — catch it.
  for (const [i, line] of lines.entries()) {
    const m = line.match(ALLOW)
    if (m && !RULE_IDS.has(m[1])) {
      unknownAllow.push(`${relative(root, file)}:${i + 1}  unknown rule "${m[1]}"`)
    }
  }
}

for (const u of unknownAllow) console.error(`✗ ${u}`)

if (violations || unknownAllow.length) {
  console.error(
    `\n✗ ${violations} violation(s)${allowed ? `, ${allowed} allowed by comment` : ""}. See AGENTS.md → Rules that always apply.`
  )
  process.exit(1)
}
console.log(
  `✓ design rules hold across ${files.length} files${allowed ? ` (${allowed} stated exception${allowed === 1 ? "" : "s"})` : ""}`
)
