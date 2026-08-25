"use client"

import {
  FunnelSimpleIcon,
  ExportIcon,
  DotsThreeVerticalIcon,
} from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BentoPanel, BentoRow } from "@/components/ui/bento"
import { Kpi } from "@/components/ui/kpi"
import { DataTableCard } from "@/components/ui/data-table-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ----------------------------------------------------------------- mock data
const kpis = [
  { label: "Total orders", value: "1,284", delta: 8.1 },
  { label: "Awaiting fulfillment", value: "18", delta: -8 },
  { label: "Fulfilled, 30d", value: "1,102", delta: 6.4 },
  { label: "Avg. order value", value: "$312", delta: 2.4 },
]

type OrderStatus =
  | "Fulfilled"
  | "Processing"
  | "Pending"
  | "Cancelled"
  | "Refunded"

const orders: {
  id: string
  name: string
  email: string
  status: OrderStatus
  items: number
  total: number
  date: string
}[] = [
  {
    id: "#3102",
    name: "Astrid Lindqvist",
    email: "astrid@hej.se",
    status: "Processing",
    items: 3,
    total: 1290,
    date: "Jun 17, 2026",
  },
  {
    id: "#3101",
    name: "Marcus Bell",
    email: "m.bell@acme.io",
    status: "Pending",
    items: 1,
    total: 480.5,
    date: "Jun 17, 2026",
  },
  {
    id: "#3100",
    name: "Yuki Tanaka",
    email: "yuki@studio.jp",
    status: "Fulfilled",
    items: 5,
    total: 2340,
    date: "Jun 16, 2026",
  },
  {
    id: "#3099",
    name: "Olivia Romero",
    email: "olivia@romero.co",
    status: "Refunded",
    items: 2,
    total: 99,
    date: "Jun 16, 2026",
  },
  {
    id: "#3098",
    name: "David Okafor",
    email: "d.okafor@mail.com",
    status: "Processing",
    items: 2,
    total: 760.25,
    date: "Jun 15, 2026",
  },
  {
    id: "#3097",
    name: "Lena Novak",
    email: "lena@novak.eu",
    status: "Fulfilled",
    items: 4,
    total: 1599.99,
    date: "Jun 15, 2026",
  },
  {
    id: "#3096",
    name: "Sam Whitfield",
    email: "sam@whitfield.us",
    status: "Pending",
    items: 1,
    total: 215,
    date: "Jun 14, 2026",
  },
  {
    id: "#3095",
    name: "Priya Nair",
    email: "priya@nair.in",
    status: "Cancelled",
    items: 3,
    total: 540,
    date: "Jun 14, 2026",
  },
  {
    id: "#3094",
    name: "Tom Andersson",
    email: "tom@anders.se",
    status: "Fulfilled",
    items: 6,
    total: 2890.5,
    date: "Jun 13, 2026",
  },
]

const statusVariant: Record<
  OrderStatus,
  "secondary" | "outline" | "destructive"
> = {
  Fulfilled: "secondary",
  Processing: "outline",
  Pending: "outline",
  Cancelled: "destructive",
  Refunded: "destructive",
}

const initials = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" })

// ----------------------------------------------------------------- page
export function Orders() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-page-title">All orders</h1>

      <BentoPanel>
        <BentoRow>
          {kpis.map((k) => (
            <Kpi
              key={k.label}
              label={k.label}
              value={k.value}
              delta={k.delta}
            />
          ))}
        </BentoRow>
      </BentoPanel>

      <DataTableCard
        title="Orders"
        description={`${orders.length} of 1,284 orders`}
        actions={
          <>
            <Button size="sm" variant="ghost">
              <FunnelSimpleIcon />
              Filter
            </Button>
            <Button size="sm" variant="ghost">
              <ExportIcon />
              Export
            </Button>
          </>
        }
      >
        <Table className="border-t">
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow className="h-14" key={o.id}>
                <TableCell className="font-medium tabular-nums">
                  {o.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-6 after:hidden">
                      <AvatarFallback className="text-caption">
                        {initials(o.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <div className="font-medium">{o.name}</div>
                      <div className="text-caption text-muted-foreground">
                        {o.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {o.items}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {money(o.total)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {o.date}
                </TableCell>
                <TableCell className="text-right">
                  <Button aria-label="More" size="icon-sm" variant="ghost">
                    <DotsThreeVerticalIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTableCard>
    </div>
  )
}
