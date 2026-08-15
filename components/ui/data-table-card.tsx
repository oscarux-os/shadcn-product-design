import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

/**
 * A card that frames a data table: an optional header (title + description +
 * actions) and an inset table region (px-3) so the borders stay off the card
 * edges while the row hover/selection background keeps breathing room around
 * the content instead of hugging it.
 *
 * Pass a <Table className="border-t"> as children and let the columns keep
 * their default cell padding — the content then lines up with the header
 * (12px container + 12px cell = 24px) and the hover sits inside the borders.
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
      <div className="px-3 pb-2">{children}</div>
    </Card>
  )
}

export { DataTableCard }
