"use client";

import * as React from "react";
import {
	PackageIcon,
	ArrowRightIcon,
	DotsThreeVerticalIcon,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BentoPanel, BentoRow } from "@/components/ui/bento";
import { Kpi } from "@/components/ui/kpi";
import { MiniChart } from "@/components/ui/mini-chart";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from "@/components/ui/item";

// ----------------------------------------------------------------- mock data
const days = [
	"2026-05-21",
	"2026-05-25",
	"2026-05-29",
	"2026-06-02",
	"2026-06-06",
	"2026-06-10",
	"2026-06-14",
	"2026-06-18",
];
const zip = (values: number[]) => days.map((date, i) => ({ date, v: values[i] }));

const balanceData = zip([362, 371, 380, 388, 392, 397, 401, 405]);
const revenueData = zip([21, 24, 27, 30, 33, 38, 44, 49]);
const volumeData = zip([45, 51, 58, 62, 71, 88, 124, 142]);

type OrderStatus = "Processing" | "Packed" | "Awaiting stock" | "On hold";

const activeOrders: {
	id: string;
	customer: string;
	items: number;
	amount: number;
	note: string;
	status: OrderStatus;
}[] = [
	{ id: "#3102", customer: "Astrid Lindqvist", items: 3, amount: 1290, note: "Ships Jun 20", status: "Processing" },
	{ id: "#3100", customer: "Yuki Tanaka", items: 5, amount: 2340, note: "Ready to ship", status: "Packed" },
	{ id: "#3098", customer: "David Okafor", items: 2, amount: 760.25, note: "1 item backordered", status: "Awaiting stock" },
	{ id: "#3096", customer: "Sam Whitfield", items: 1, amount: 215, note: "Payment review", status: "On hold" },
];

const statusVariant: Record<OrderStatus, "secondary" | "outline" | "destructive"> = {
	Processing: "outline",
	Packed: "secondary",
	"Awaiting stock": "outline",
	"On hold": "destructive",
};

const money = (n: number) =>
	n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// ----------------------------------------------------------------- page
export function Overview() {
	return (
		<div className="flex flex-1 flex-col gap-6">
			<h1 className="font-medium text-xl leading-tight">Good morning, Oscar</h1>

			<BentoPanel>
				<BentoRow>
					<Kpi label="Open balance" value={money(405000)} delta={4.2}>
						<MiniChart data={balanceData} color="var(--chart-5)" className="mt-3 h-28" />
					</Kpi>
					<Kpi label="Revenue, 30d" value={money(48290)} delta={12.4}>
						<MiniChart data={revenueData} color="var(--chart-2)" className="mt-3 h-28" />
					</Kpi>
				</BentoRow>
				<Kpi label="Order volume, 30d" value="142" delta={84}>
					<MiniChart data={volumeData} color="var(--chart-1)" className="mt-3 h-36" />
				</Kpi>
			</BentoPanel>

			{/* active orders */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<h2 className="font-heading text-base font-medium">Active orders</h2>
						<Badge variant="secondary">{activeOrders.length}</Badge>
					</div>
					<Button size="sm" variant="link" className="text-muted-foreground">
						View all
						<ArrowRightIcon />
					</Button>
				</div>

				<Tabs defaultValue="all">
					<TabsList variant="line">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="mine">My orders</TabsTrigger>
					</TabsList>
				</Tabs>

				<Card className="overflow-hidden py-0">
					<ItemGroup>
						{activeOrders.map((o, i) => (
							<React.Fragment key={o.id}>
								{i > 0 && <ItemSeparator className="mx-4 data-horizontal:w-auto" />}
								<Item>
									<ItemMedia variant="icon" className="rounded-full border-0">
										<PackageIcon />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>
											<span className="tabular-nums">{o.id}</span> · {o.customer}
										</ItemTitle>
										<ItemDescription className="tabular-nums">
											{o.items} items · {money(o.amount)} · {o.note}
										</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Badge variant={statusVariant[o.status]}>{o.status}</Badge>
										<Button size="sm" variant="outline">
											Review
										</Button>
										<Button aria-label="More" size="icon-sm" variant="ghost">
											<DotsThreeVerticalIcon />
										</Button>
									</ItemActions>
								</Item>
							</React.Fragment>
						))}
					</ItemGroup>
				</Card>
			</div>
		</div>
	);
}
