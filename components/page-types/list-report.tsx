"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  DotsThreeVerticalIcon,
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableCard } from "@/components/ui/data-table-card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { VariantProps } from "class-variance-authority"

// ----------------------------------------------------------------- mock data
type Status = "Open" | "Pending" | "Resolved" | "Closed"
type Priority = "Low" | "Medium" | "High"

type Ticket = {
  id: string
  subject: string
  requester: string
  status: Status
  priority: Priority
  updated: string
}

const tickets: Ticket[] = [
  { id: "T-2041", subject: "Login redirect loop on SSO", requester: "Astrid Lindqvist", status: "Open", priority: "High", updated: "2h ago" },
  { id: "T-2040", subject: "Invoice PDF missing VAT line", requester: "Marcus Bell", status: "Pending", priority: "Medium", updated: "3h ago" },
  { id: "T-2039", subject: "Cannot remove seat from plan", requester: "Yuki Tanaka", status: "Open", priority: "Medium", updated: "5h ago" },
  { id: "T-2038", subject: "API rate limit too aggressive", requester: "Olivia Romero", status: "Resolved", priority: "High", updated: "6h ago" },
  { id: "T-2037", subject: "Dark mode contrast on charts", requester: "David Okafor", status: "Closed", priority: "Low", updated: "1d ago" },
  { id: "T-2036", subject: "Export stuck at 90%", requester: "Lena Novak", status: "Open", priority: "High", updated: "1d ago" },
  { id: "T-2035", subject: "Typo in shipping confirmation email", requester: "Sam Whitfield", status: "Closed", priority: "Low", updated: "1d ago" },
  { id: "T-2034", subject: "Webhook signature mismatch", requester: "Priya Nair", status: "Pending", priority: "High", updated: "2d ago" },
  { id: "T-2033", subject: "Bulk import ignores custom fields", requester: "Tom Andersson", status: "Open", priority: "Medium", updated: "2d ago" },
  { id: "T-2032", subject: "Refund total off by rounding", requester: "Astrid Lindqvist", status: "Resolved", priority: "Medium", updated: "2d ago" },
  { id: "T-2031", subject: "Slow load on customer list", requester: "Marcus Bell", status: "Open", priority: "Low", updated: "3d ago" },
  { id: "T-2030", subject: "Duplicate order confirmation sent", requester: "Yuki Tanaka", status: "Closed", priority: "Medium", updated: "3d ago" },
  { id: "T-2029", subject: "Cannot reset password from mobile", requester: "Olivia Romero", status: "Pending", priority: "High", updated: "4d ago" },
  { id: "T-2028", subject: "Currency symbol wrong for SEK", requester: "David Okafor", status: "Resolved", priority: "Low", updated: "4d ago" },
  { id: "T-2027", subject: "Sidebar collapses on refresh", requester: "Lena Novak", status: "Open", priority: "Low", updated: "5d ago" },
  { id: "T-2026", subject: "Tax rate not applied to draft orders", requester: "Sam Whitfield", status: "Open", priority: "High", updated: "5d ago" },
  { id: "T-2025", subject: "Search ignores diacritics", requester: "Priya Nair", status: "Closed", priority: "Low", updated: "6d ago" },
  { id: "T-2024", subject: "Staff role can't view reports", requester: "Tom Andersson", status: "Pending", priority: "Medium", updated: "6d ago" },
]

const savedViews: { id: string; label: string; status: Status | "all" }[] = [
  { id: "all", label: "All", status: "all" },
  { id: "open", label: "Open", status: "Open" },
  { id: "pending", label: "Pending", status: "Pending" },
]

const statusVariant: Record<Status, VariantProps<typeof badgeVariants>["variant"]> = {
  Open: "info",
  Pending: "warning",
  Resolved: "success",
  Closed: "outline",
}

const PAGE_SIZE = 8

// ----------------------------------------------------------------- page
export function ListReport() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const view = searchParams.get("view") ?? "all"
  const activeView = savedViews.find((v) => v.id === view) ?? savedViews[0]
  const q = searchParams.get("q") ?? ""
  const status = searchParams.get("status") ?? activeView.status
  const priority = searchParams.get("priority") ?? "all"
  const page = Number(searchParams.get("page") ?? "1")

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [notice, setNotice] = useState<{
    title: string
    description: string
  } | null>(null)

  function setParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "" || value === "all") params.delete(key)
      else params.set(key, value)
    }
    if (!("page" in next)) params.delete("page")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const viewDrifted = status !== activeView.status

  const filtered = useMemo(
    () =>
      tickets.filter((t) => {
        if (
          q &&
          !`${t.subject} ${t.requester}`.toLowerCase().includes(q.toLowerCase())
        )
          return false
        if (status !== "all" && t.status !== status) return false
        if (priority !== "all" && t.priority !== priority) return false
        return true
      }),
    [q, status, priority]
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const activeFilters = [
    q ? { key: "q", label: `"${q}"`, clear: () => setParams({ q: null }) } : null,
    status !== "all"
      ? { key: "status", label: status, clear: () => setParams({ status: null }) }
      : null,
    priority !== "all"
      ? { key: "priority", label: priority, clear: () => setParams({ priority: null }) }
      : null,
  ].filter((f): f is { key: string; label: string; clear: () => void } => f !== null)

  const allOnPageSelected =
    paged.length > 0 && paged.every((t) => selected.has(t.id))

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allOnPageSelected) paged.forEach((t) => next.delete(t.id))
      else paged.forEach((t) => next.add(t.id))
      return next
    })
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleExport(count: number) {
    setNotice({
      title: "Export finished",
      description: `${count} ${count === 1 ? "ticket" : "tickets"} exported to CSV.`,
    })
  }

  function handleDelete(count: number) {
    setSelected(new Set())
    setNotice({
      title: "Tickets deleted",
      description: `${count} ${count === 1 ? "ticket" : "tickets"} deleted.`,
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* 1. Notisplats — populated by an action's outcome, not shown by default */}
      {notice && (
        <Alert>
          <AlertTitle>{notice.title}</AlertTitle>
          <AlertDescription>{notice.description}</AlertDescription>
          <AlertAction>
            <Button
              aria-label="Dismiss"
              size="icon-sm"
              variant="ghost"
              onClick={() => setNotice(null)}
            >
              <XIcon />
            </Button>
          </AlertAction>
        </Alert>
      )}

      {/* 2. Sidhuvud */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-page-title">Tickets</h1>
          <Badge variant="secondary">{tickets.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost">
            <UploadSimpleIcon />
            Import
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleExport(filtered.length)}
          >
            <DownloadSimpleIcon />
            Export
          </Button>
          <Button size="sm">
            <PlusIcon />
            New ticket
          </Button>
        </div>
      </div>

      {/* 3. Sparade vyer */}
      <div className="flex items-center gap-3">
        <Tabs
          value={view}
          onValueChange={(v) => setParams({ view: v, status: null, page: null })}
        >
          <TabsList>
            {savedViews.map((v) => (
              <TabsTrigger key={v.id} value={v.id}>
                {v.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {viewDrifted && (
          <span className="text-caption text-muted-foreground">Unsaved</span>
        )}
      </div>

      {/* 4. Filterrad */}
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search tickets…"
            defaultValue={q}
            onChange={(e) => setParams({ q: e.target.value || null, page: null })}
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setParams({ status: v, page: null })}
        >
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={priority}
          onValueChange={(v) => setParams({ priority: v, page: null })}
        >
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 5. Aktiva filter — 6. Massåtgärdsfält (replaces this row when rows are selected) */}
      <div className="flex h-9 items-center gap-2">
        {selected.size > 0 ? (
          <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-muted px-4 py-1.5">
            <span className="text-label">{selected.size} selected</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleExport(selected.size)}
              >
                <DownloadSimpleIcon />
                Export
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(selected.size)}
              >
                <TrashIcon />
                Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
            </div>
          </div>
        ) : (
          activeFilters.length > 0 && (
            <>
              <div className="flex flex-wrap items-center gap-1">
                {activeFilters.map((f) => (
                  <Badge key={f.key} variant="secondary" className="gap-1">
                    {f.label}
                    <button
                      aria-label={`Remove ${f.label} filter`}
                      onClick={f.clear}
                      className="rounded-full"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                ))}
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() =>
                    setParams({ q: null, status: null, priority: null, page: null })
                  }
                >
                  Clear all
                </Button>
              </div>
              <span className="ml-auto text-caption text-muted-foreground">
                {filtered.length} of {tickets.length} tickets
              </span>
            </>
          )
        )}
      </div>

      {/* 7. Tabellen */}
      <DataTableCard>
        <Table className="border-t">
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">
                <Checkbox
                  checked={allOnPageSelected}
                  onCheckedChange={toggleAllOnPage}
                  aria-label="Select all on this page"
                />
              </TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((t) => (
              <TableRow
                key={t.id}
                className="group"
                data-state={selected.has(t.id) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={selected.has(t.id)}
                    onCheckedChange={() => toggleRow(t.id)}
                    aria-label={`Select ${t.subject}`}
                  />
                </TableCell>
                <TableCell>
                  <button className="text-left font-medium hover:underline">
                    {t.subject}
                  </button>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {t.requester}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {t.priority}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {t.updated}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    aria-label="More actions"
                    size="icon-sm"
                    variant="ghost"
                    className={cn(
                      "opacity-0 transition-opacity duration-instant group-hover:opacity-100",
                      selected.has(t.id) && "opacity-100"
                    )}
                  >
                    <DotsThreeVerticalIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No tickets match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataTableCard>

      {/* 8. Paginering */}
      <Pagination className="justify-between">
        <span className="text-caption text-muted-foreground">
          Page {currentPage} of {pageCount}
        </span>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
              onClick={(e) => {
                e.preventDefault()
                setParams({ page: String(currentPage - 1) })
              }}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === currentPage}
                onClick={(e) => {
                  e.preventDefault()
                  setParams({ page: String(p) })
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage === pageCount}
              className={cn(
                currentPage === pageCount && "pointer-events-none opacity-50"
              )}
              onClick={(e) => {
                e.preventDefault()
                setParams({ page: String(currentPage + 1) })
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
