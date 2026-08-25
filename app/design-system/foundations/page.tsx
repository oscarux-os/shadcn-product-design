import Link from "next/link"
import {
  ArrowsOutLineHorizontalIcon,
  ChartLineIcon,
  CheckCircleIcon,
  CursorClickIcon,
  DropHalfBottomIcon,
  PaletteIcon,
  TextTIcon,
} from "@phosphor-icons/react/dist/ssr"

import { AppShell } from "@/components/app-shell"
import { DesignNarrative } from "@/components/design-system/foundations/design-narrative"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDesignNarrativeSections } from "@/lib/design-reference"

const designAreas = [
  {
    title: "Colour",
    description:
      "Four inputs generate both themes. Intents communicate state; primary alone carries the brand.",
    href: "/design-system/foundations/colour",
    icon: PaletteIcon,
  },
  {
    title: "Typography",
    description:
      "One family, two weights and eight roles. The largest type is a number, never display copy.",
    href: "/design-system/foundations/typography",
    icon: TextTIcon,
  },
  {
    title: "Layout & spacing",
    description:
      "A fixed sidebar and fluid content replace a page grid. Wide data scrolls inside its container.",
    href: "/design-system/foundations/layout-spacing",
    icon: ArrowsOutLineHorizontalIcon,
  },
  {
    title: "Depth & shape",
    description:
      "Lightness carries elevation, while one authored radius produces the complete shape ladder.",
    href: "/design-system/foundations/depth-shape",
    icon: DropHalfBottomIcon,
  },
  {
    title: "Motion & interaction",
    description:
      "Motion is feedback: 100ms for state, 200ms for structure, with a hard 250ms ceiling.",
    href: "/design-system/foundations/motion-interaction",
    icon: CursorClickIcon,
  },
  {
    title: "Controls & density",
    description:
      "Controls stay compact, figures align, and real data determines whether a pattern survives.",
    href: "/design-system/foundations/controls-density",
    icon: CheckCircleIcon,
  },
  {
    title: "Charts & components",
    description:
      "Series colour shows identity, while shared component contracts keep every view consistent.",
    href: "/design-system/foundations/charts-components",
    icon: ChartLineIcon,
  },
] as const

export default async function Page() {
  const narratives = await getDesignNarrativeSections()
  const overview = narratives.filter((section) => section.id === "overview")

  return (
    <AppShell>
      <main className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-page-title">Foundations</h1>
            <Badge variant="info">Live from DESIGN.md</Badge>
          </div>
          <p className="max-w-3xl text-body text-muted-foreground">
            The principles and values that govern every interface decision in
            the dashboard. Choose an area to see its rationale and complete
            token snapshot.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {designAreas.map((area) => {
            const Icon = area.icon

            return (
              <Link className="group" href={area.href} key={area.title}>
                <Card
                  className="h-full transition-transform group-hover:-translate-y-0.5"
                  size="sm"
                >
                  <CardHeader>
                    <Icon className="size-5 text-primary" />
                    <CardTitle>{area.title}</CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        <DesignNarrative sections={overview} />
      </main>
    </AppShell>
  )
}
