import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * `text-base` at the base breakpoint is deliberate and NOT a type role: iOS
 * Safari zooms the viewport on focus for anything under 16px. `md:text-body`
 * takes over the role from 768px up, where no such zoom exists.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // design-lint-allow: raw-size — iOS Safari zooms the viewport on focus below 16px; md:text-body takes the role from 768px up
        "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-label file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-body dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
