import { Suspense } from "react"

import { AppShell } from "@/components/app-shell"
import { ListReport } from "@/components/page-types/list-report"

export default function Page() {
  return (
    <AppShell>
      <Suspense>
        <ListReport />
      </Suspense>
    </AppShell>
  )
}
