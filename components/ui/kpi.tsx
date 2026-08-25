import * as React from "react"

import { cn } from "@/lib/utils"
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta"

/**
 * A single metric cell: small eyebrow label + caret delta on top, large value
 * beneath. Pass children (e.g. a MiniChart) to render below the value.
 * Sized as a flex cell so it drops straight into a <BentoRow>.
 */
function Kpi({
  label,
  value,
  delta,
  className,
  children,
}: {
  label: React.ReactNode
  value: React.ReactNode
  delta?: number
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("flex-1 px-5 py-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-caption tracking-wide text-muted-foreground">
          {label}
        </span>
        {typeof delta === "number" ? (
          <Delta value={delta} className="text-caption">
            <DeltaIcon />
            <DeltaValue />
          </Delta>
        ) : null}
      </div>
      <p className="mt-1 text-metric tabular-nums">{value}</p>
      {children}
    </div>
  )
}

export { Kpi }
