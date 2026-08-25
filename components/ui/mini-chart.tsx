"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { cn } from "@/lib/utils"
import { formatDate } from "@/components/formater"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

/**
 * Compact area chart sharing the dashboard sales-chart styling: dashed grid,
 * date axis, tooltip, thin linear stroke, 0.4 → 0 gradient fill.
 */
function MiniChart({
  data,
  color = "var(--chart-1)",
  className,
}: {
  data: { date: string; v: number }[]
  color?: string
  className?: string
}) {
  const id = React.useId().replace(/:/g, "")
  const config = { v: { label: "value", color } } satisfies ChartConfig

  return (
    <ChartContainer
      config={config}
      className={cn("aspect-auto w-full", className)}
    >
      <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          className="stroke-border"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          axisLine={false}
          dataKey="date"
          tickFormatter={(v) => formatDate(String(v), "day-month")}
          tickLine={false}
          tickMargin={8}
          minTickGap={24}
        />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <Area
          dataKey="v"
          fill={`url(#grad-${id})`}
          fillOpacity={0.4}
          stroke={color}
          strokeWidth={0.8}
          type="linear"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export { MiniChart }
