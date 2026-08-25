"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "@phosphor-icons/react"

import {
  getShowcaseEntry,
  usedIn,
  usedInHref,
} from "@/components/showcase/registry"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ComponentDetail({ slug }: { slug: string }) {
  const entry = getShowcaseEntry(slug)

  if (!entry) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <Button
          asChild
          className="-ml-2 w-fit text-muted-foreground"
          size="sm"
          variant="ghost"
        >
          <Link href="/components">
            <ArrowLeftIcon />
            Components
          </Link>
        </Button>
        <p className="text-muted-foreground">Component "{slug}" not found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Button
          asChild
          className="-ml-2 w-fit text-muted-foreground"
          size="sm"
          variant="ghost"
        >
          <Link href="/components">
            <ArrowLeftIcon />
            Components
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-page-title">{entry.name}</h1>
          <Badge className="tracking-wide uppercase" variant="outline">
            {entry.tag}
          </Badge>
        </div>
        <p className="max-w-2xl text-body text-muted-foreground">
          {entry.description}
        </p>
        {usedIn[entry.slug]?.length ? (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-body text-muted-foreground">Used in</span>
            {usedIn[entry.slug].map((u) => {
              const href = usedInHref(u)
              return href ? (
                <Badge asChild key={u} variant="secondary">
                  <Link href={href}>{u}</Link>
                </Badge>
              ) : (
                <Badge key={u} variant="secondary">
                  {u}
                </Badge>
              )
            })}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {entry.examples.map((ex, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-caption tracking-wide text-muted-foreground">
                {ex.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-background p-6">{ex.node}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
