/** Plain slug list — safe to import from server components (generateStaticParams). */
export const showcaseSlugs = [
  "button",
  "badge",
  "delta",
  "avatar",
  "kpi",
  "mini-chart",
  "bento",
  "data-table-card",
  "tabs",
  "item",
  "card",
  "separator",
] as const

export type ShowcaseSlug = (typeof showcaseSlugs)[number]
