import type { CSSProperties } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, LightbulbIcon } from "@phosphor-icons/react/dist/ssr"

import { AppShell } from "@/components/app-shell"
import { DesignNarrative } from "@/components/design-system/foundations/design-narrative"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getDesignNarrativeSections,
  getDesignTokenSections,
  type DesignToken,
  type DesignTokenSection,
} from "@/lib/design-reference"

const pages = {
  colour: {
    title: "Colour",
    description:
      "A colour grammar generated from four inputs, evaluated once for light mode and once for dark mode.",
    principle:
      "Intents mark state, not brand. Passive status uses a soft pair; solid fills belong to actions. Chart colours identify series, never sentiment.",
    narrativeIds: ["colours"],
    sectionIds: ["palette", "colors", "colors-dark"],
  },
  typography: {
    title: "Typography",
    description:
      "One family, two weights and eight roles create a compact, predictable hierarchy.",
    principle:
      "The largest type is a number. Emphasis comes from role, colour or surface—not an improvised jump in size or weight.",
    narrativeIds: ["typography"],
    sectionIds: ["fonts", "tracking", "typography", "font-weights"],
  },
  "layout-spacing": {
    title: "Layout & spacing",
    description:
      "The shell, breakpoint and spacing decisions that keep dense information usable at every width.",
    principle:
      "The page is fluid, not a centred grid. Semantic gaps belong to layout; component padding stays local to the component.",
    narrativeIds: ["layout"],
    sectionIds: ["spacing", "breakpoints", "layout"],
  },
  "depth-shape": {
    title: "Depth & shape",
    description:
      "A small elevation ladder and a single authored radius define the system's surfaces.",
    principle:
      "Closer surfaces are lighter in both themes. Shadows confirm depth, and inner surfaces always take a smaller radius step.",
    narrativeIds: ["elevation-and-depth", "shapes"],
    sectionIds: ["rounded", "elevation"],
  },
  "motion-interaction": {
    title: "Motion & interaction",
    description:
      "Fast, consistent feedback for state changes, focus and physical interaction.",
    principle:
      "Motion must clarify change without making the tool feel slow. Every interactive element keeps a visible focus treatment.",
    narrativeIds: ["motion"],
    sectionIds: ["motion", "focus-ring", "states"],
  },
  "controls-density": {
    title: "Controls & density",
    description:
      "A compact control ladder and explicit data density values designed for dashboard work.",
    principle:
      "Default controls are 36px, related controls align, and tabular content stays dense without sacrificing scanability.",
    narrativeIds: ["components"],
    sectionIds: ["control-sizes", "density"],
  },
  "charts-components": {
    title: "Charts & components",
    description:
      "The contracts that connect data visualisation with the shared component vocabulary.",
    principle:
      "Chart series share a lightness so none outranks another. One raised action per view preserves a clear hierarchy.",
    narrativeIds: ["charts", "components"],
    sectionIds: ["charts", "components"],
  },
} as const

type PageSlug = keyof typeof pages

export function generateStaticParams() {
  return Object.keys(pages).map((section) => ({ section }))
}

function displayValue(value: string) {
  return value.replaceAll("{", "").replaceAll("}", "")
}

function TokenRows({ tokens }: { tokens: DesignToken[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((token) => (
          <TableRow key={token.path}>
            <TableCell className="text-muted-foreground">
              {token.path}
            </TableCell>
            <TableCell className="text-right text-code tabular-nums">
              {displayValue(token.value)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ColourRows({
  light,
  dark,
}: {
  light: DesignToken[]
  dark: DesignToken[]
}) {
  const darkByPath = new Map(dark.map((token) => [token.path, token.value]))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Light</TableHead>
          <TableHead>Dark</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {light.map((token) => {
          const style = {
            "--token-preview": `var(--${token.path})`,
          } as CSSProperties

          return (
            <TableRow key={token.path}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-4 shrink-0 rounded-sm bg-(--token-preview) ring-1 ring-border"
                    style={style}
                  />
                  <span>{token.path}</span>
                </div>
              </TableCell>
              <TableCell className="text-code tabular-nums">
                {token.value}
              </TableCell>
              <TableCell className="text-code tabular-nums">
                {darkByPath.get(token.path) ?? "—"}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function StandardSection({ section }: { section: DesignTokenSection }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>
          Authored values and references from DESIGN.md.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TokenRows tokens={section.tokens} />
      </CardContent>
    </Card>
  )
}

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  if (!(section in pages)) notFound()

  const page = pages[section as PageSlug]
  const [allSections, allNarratives] = await Promise.all([
    getDesignTokenSections(),
    getDesignNarrativeSections(),
  ])
  const selectedSections = page.sectionIds
    .map((id) => allSections.find((item) => item.id === id))
    .filter((item): item is DesignTokenSection => Boolean(item))
  const palette = selectedSections.find((item) => item.id === "palette")
  const lightColours = selectedSections.find((item) => item.id === "colors")
  const darkColours = selectedSections.find((item) => item.id === "colors-dark")
  const standardSections = selectedSections.filter(
    (item) => !["colors", "colors-dark"].includes(item.id)
  )
  const narratives = page.narrativeIds
    .map((id) => allNarratives.find((item) => item.id === id))
    .filter((item) => item !== undefined)

  return (
    <AppShell>
      <main className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col items-start gap-4">
          <Button asChild size="sm" variant="ghost">
            <Link href="/design-system/foundations">
              <ArrowLeftIcon />
              Foundations
            </Link>
          </Button>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-page-title">{page.title}</h1>
              <Badge variant="info">Live from DESIGN.md</Badge>
            </div>
            <p className="max-w-3xl text-body text-muted-foreground">
              {page.description}
            </p>
          </div>
        </div>

        <Alert>
          <LightbulbIcon />
          <AlertTitle>Principle</AlertTitle>
          <AlertDescription>{page.principle}</AlertDescription>
        </Alert>

        <DesignNarrative sections={narratives} />

        {section === "colour" ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {palette ? <StandardSection section={palette} /> : null}
            {lightColours && darkColours ? (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Derived colour tokens</CardTitle>
                  <CardDescription>
                    The swatch follows the active theme; both generated values
                    are shown for comparison.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ColourRows
                    dark={darkColours.tokens}
                    light={lightColours.tokens}
                  />
                </CardContent>
              </Card>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {standardSections.map((item) => (
              <StandardSection key={item.id} section={item} />
            ))}
          </div>
        )}
      </main>
    </AppShell>
  )
}
