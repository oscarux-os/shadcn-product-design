import { AppShell } from "@/components/app-shell"
import { ComponentDetail } from "@/components/showcase/component-detail"
import { showcaseSlugs } from "@/components/showcase/slugs"

export function generateStaticParams() {
  return showcaseSlugs.map((slug) => ({ slug }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <AppShell>
      <ComponentDetail slug={slug} />
    </AppShell>
  )
}
