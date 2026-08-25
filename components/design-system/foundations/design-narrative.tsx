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
import type {
  DesignNarrativeBlock,
  DesignNarrativeSection,
} from "@/lib/design-reference"

function InlineText({ children }: { children: string }) {
  const parts = children.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span className="text-label" key={index}>
          {part.slice(2, -2)}
        </span>
      )
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code className="text-code" key={index}>
          {part.slice(1, -1)}
        </code>
      )
    }

    return part
  })
}

function NarrativeBlock({ block }: { block: DesignNarrativeBlock }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-body text-muted-foreground">
        <InlineText>{block.text}</InlineText>
      </p>
    )
  }

  if (block.type === "list") {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-5 text-body text-muted-foreground marker:text-primary">
        {block.items.map((item) => (
          <li key={item}>
            <InlineText>{item}</InlineText>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {block.headers.map((header) => (
            <TableHead key={header}>
              <InlineText>{header}</InlineText>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {block.rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>
                <InlineText>{cell}</InlineText>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function DesignNarrative({
  sections,
}: {
  sections: DesignNarrativeSection[]
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2" data-slot="design-narrative">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>Rationale from DESIGN.md.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {section.blocks.map((block, index) => (
              <NarrativeBlock block={block} key={index} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
