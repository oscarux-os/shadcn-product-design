import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

/**
 * A card that frames a data table: an optional header (title + description +
 * actions) and an inset table region (px-6) so the table's borders breathe.
 *
 * Pass a <Table className="border-t"> as children, and give the first/last
 * columns `pl-0` / `pr-0` so the row hairlines align to the card padding.
 */
function DataTableCard({
  title,
  description,
  actions,
  className,
  children,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="min-w-0">
            {title && <h2 className="font-medium text-base">{title}</h2>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
      )}
      <div className="px-6 pb-2">{children}</div>
    </Card>
  )
}

export { DataTableCard }
