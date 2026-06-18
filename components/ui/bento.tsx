import * as React from "react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

/**
 * Inset divider — a hairline that respects component padding instead of running
 * full-bleed. Horizontal by default; vertical for dividing a row of cells.
 */
function InsetSeparator({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical"
  className?: string
}) {
  if (orientation === "vertical") {
    return (
      <Separator
        orientation="vertical"
        className={cn("my-4 data-vertical:w-px", className)}
      />
    )
  }
  return <Separator className={cn("mx-5 data-horizontal:w-auto", className)} />
}

/**
 * A raised surface (lighter card, soft shadow, no outline). Stacks its children
 * vertically and auto-inserts an inset hairline between each section.
 */
function BentoPanel({
  className,
  children,
}: React.ComponentProps<"div">) {
  const items = React.Children.toArray(children).filter(Boolean)
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-card shadow-soft", className)}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && <InsetSeparator />}
          {child}
        </React.Fragment>
      ))}
    </div>
  )
}

/**
 * A row of cells inside a BentoPanel. Stacks on mobile, sits in a row on sm+,
 * with an inset divider between cells (horizontal when stacked, vertical in a row).
 */
function BentoRow({
  className,
  children,
}: React.ComponentProps<"div">) {
  const items = React.Children.toArray(children).filter(Boolean)
  return (
    <div className={cn("flex flex-col sm:flex-row", className)}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <>
              <InsetSeparator className="sm:hidden" />
              <InsetSeparator orientation="vertical" className="hidden sm:block" />
            </>
          )}
          {child}
        </React.Fragment>
      ))}
    </div>
  )
}

/** A padded cell for use inside a BentoRow. */
function BentoCell({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex-1 px-5 py-4", className)} {...props} />
}

export { BentoPanel, BentoRow, BentoCell, InsetSeparator }
