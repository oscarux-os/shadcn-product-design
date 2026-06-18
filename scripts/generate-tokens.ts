import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { toCss, DEFAULT_CONFIG } from "../lib/palette/engine.ts"

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, "..", "app", "tokens.css")

writeFileSync(out, toCss(DEFAULT_CONFIG))
console.log(`✓ wrote ${out}`)
console.log(
  `  inputs: neutralHue=${DEFAULT_CONFIG.neutralHue} accentHue=${DEFAULT_CONFIG.accentHue} contrast=${DEFAULT_CONFIG.contrast}`
)
