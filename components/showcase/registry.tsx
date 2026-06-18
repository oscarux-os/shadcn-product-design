"use client";

import * as React from "react";
import { PackageIcon, TruckIcon, ReceiptIcon } from "@phosphor-icons/react";

import type { ShowcaseSlug } from "@/components/showcase/slugs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BentoPanel, BentoRow } from "@/components/ui/bento";
import { Kpi } from "@/components/ui/kpi";
import { MiniChart } from "@/components/ui/mini-chart";
import { DataTableCard } from "@/components/ui/data-table-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export type ShowcaseEntry = {
	slug: ShowcaseSlug;
	name: string;
	description: string;
	tag: string;
	/** Compact preview shown on the index card. */
	preview: React.ReactNode;
	/** Labelled examples shown on the detail page. */
	examples: { title: string; node: React.ReactNode }[];
};

const chartData = [
	"2026-05-21",
	"2026-05-25",
	"2026-05-29",
	"2026-06-02",
	"2026-06-06",
	"2026-06-10",
	"2026-06-14",
	"2026-06-18",
].map((date, i) => ({ date, v: [45, 51, 58, 62, 71, 88, 124, 142][i] }));

export const showcase: ShowcaseEntry[] = [
	{
		slug: "button",
		name: "Button",
		tag: "shadcn",
		description: "Actions with the stacked box-shadow ring, gradient sheen, state layer and press-sink.",
		preview: (
			<div className="flex flex-wrap gap-2">
				<Button size="sm">Primary</Button>
				<Button size="sm" variant="secondary">Secondary</Button>
				<Button size="sm" variant="ghost">Ghost</Button>
			</div>
		),
		examples: [
			{
				title: "Variants",
				node: (
					<div className="flex flex-wrap gap-3">
						<Button>Default</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">Destructive</Button>
						<Button variant="link">Link</Button>
					</div>
				),
			},
			{
				title: "Sizes & disabled",
				node: (
					<div className="flex flex-wrap items-center gap-3">
						<Button size="sm">Small</Button>
						<Button>Default</Button>
						<Button size="lg">Large</Button>
						<Button disabled>Disabled</Button>
					</div>
				),
			},
		],
	},
	{
		slug: "badge",
		name: "Badge",
		tag: "shadcn",
		description: "Status pills. Neutral set for general use plus generated soft intents.",
		preview: (
			<div className="flex flex-wrap gap-2">
				<Badge variant="secondary">Paid</Badge>
				<Badge variant="outline">Pending</Badge>
				<Badge variant="destructive">Overdue</Badge>
			</div>
		),
		examples: [
			{
				title: "Neutral",
				node: (
					<div className="flex flex-wrap gap-2">
						<Badge>Default</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="outline">Outline</Badge>
					</div>
				),
			},
			{
				title: "Soft intents",
				node: (
					<div className="flex flex-wrap gap-2">
						<Badge variant="success">Success</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="info">Info</Badge>
						<Badge variant="destructive">Destructive</Badge>
					</div>
				),
			},
		],
	},
	{
		slug: "delta",
		name: "Delta",
		tag: "custom",
		description: "Up/down change indicator. Caret + percentage that turns green/red by sign.",
		preview: (
			<div className="flex items-center gap-4 text-sm">
				<Delta value={12.4}><DeltaIcon /><DeltaValue /></Delta>
				<Delta value={-3.1}><DeltaIcon /><DeltaValue /></Delta>
			</div>
		),
		examples: [
			{
				title: "Default (caret)",
				node: (
					<div className="flex items-center gap-6">
						<Delta value={12.4}><DeltaIcon /><DeltaValue /></Delta>
						<Delta value={-3.1}><DeltaIcon /><DeltaValue /></Delta>
						<Delta value={0}><DeltaIcon /><DeltaValue /></Delta>
					</div>
				),
			},
			{
				title: "Badge",
				node: (
					<div className="flex items-center gap-3">
						<Delta value={8.1} variant="badge"><DeltaIcon variant="trend" /><DeltaValue /></Delta>
						<Delta value={-8} variant="badge"><DeltaIcon variant="trend" /><DeltaValue /></Delta>
					</div>
				),
			},
		],
	},
	{
		slug: "avatar",
		name: "Avatar",
		tag: "shadcn",
		description: "User/customer avatar with initials fallback. Borderless in our setup.",
		preview: (
			<div className="flex items-center gap-2">
				<Avatar className="after:hidden"><AvatarFallback>AL</AvatarFallback></Avatar>
				<Avatar className="size-6 after:hidden"><AvatarFallback className="text-[10px]">YT</AvatarFallback></Avatar>
			</div>
		),
		examples: [
			{
				title: "Sizes",
				node: (
					<div className="flex items-center gap-3">
						<Avatar className="size-6 after:hidden"><AvatarFallback className="text-[10px]">SM</AvatarFallback></Avatar>
						<Avatar className="after:hidden"><AvatarFallback>MD</AvatarFallback></Avatar>
						<Avatar className="size-10 after:hidden"><AvatarFallback>LG</AvatarFallback></Avatar>
					</div>
				),
			},
		],
	},
	{
		slug: "kpi",
		name: "Kpi",
		tag: "custom",
		description: "Metric cell: eyebrow label + caret delta on top, large value below. Optional chart.",
		preview: (
			<div className="w-full rounded-2xl bg-card shadow-soft">
				<Kpi label="Revenue, 30d" value="$48,290" delta={12.4} />
			</div>
		),
		examples: [
			{
				title: "Plain",
				node: (
					<div className="max-w-xs rounded-2xl bg-card shadow-soft">
						<Kpi label="Total orders" value="1,284" delta={8.1} />
					</div>
				),
			},
			{
				title: "With chart",
				node: (
					<div className="max-w-sm rounded-2xl bg-card shadow-soft">
						<Kpi label="Order volume, 30d" value="142" delta={84}>
							<MiniChart data={chartData} color="var(--chart-1)" className="mt-3 h-28" />
						</Kpi>
					</div>
				),
			},
		],
	},
	{
		slug: "mini-chart",
		name: "MiniChart",
		tag: "custom",
		description: "Compact area chart: dashed grid, date axis, tooltip, thin linear stroke, gradient fill.",
		preview: (
			<div className="w-full">
				<MiniChart data={chartData} color="var(--chart-2)" className="h-24" />
			</div>
		),
		examples: [
			{
				title: "Tinted variants",
				node: (
					<div className="grid gap-4 sm:grid-cols-3">
						<MiniChart data={chartData} color="var(--chart-1)" className="h-28" />
						<MiniChart data={chartData} color="var(--chart-2)" className="h-28" />
						<MiniChart data={chartData} color="var(--chart-5)" className="h-28" />
					</div>
				),
			},
		],
	},
	{
		slug: "bento",
		name: "BentoPanel",
		tag: "custom",
		description: "Raised surface that stacks sections with inset hairline dividers (no outer ring).",
		preview: (
			<BentoPanel className="w-full">
				<BentoRow>
					<Kpi label="Orders" value="1,284" delta={8.1} />
					<Kpi label="Revenue" value="$48k" delta={12.4} />
				</BentoRow>
			</BentoPanel>
		),
		examples: [
			{
				title: "Row of cells",
				node: (
					<BentoPanel>
						<BentoRow>
							<Kpi label="Total orders" value="1,284" delta={8.1} />
							<Kpi label="Awaiting" value="18" delta={-8} />
							<Kpi label="Fulfilled" value="1,102" delta={6.4} />
						</BentoRow>
					</BentoPanel>
				),
			},
			{
				title: "Row + full-width section",
				node: (
					<BentoPanel>
						<BentoRow>
							<Kpi label="Open balance" value="$405k" delta={4.2} />
							<Kpi label="Revenue, 30d" value="$48,290" delta={12.4} />
						</BentoRow>
						<Kpi label="Order volume, 30d" value="142" delta={84}>
							<MiniChart data={chartData} color="var(--chart-1)" className="mt-3 h-28" />
						</Kpi>
					</BentoPanel>
				),
			},
		],
	},
	{
		slug: "data-table-card",
		name: "DataTableCard",
		tag: "custom",
		description: "Frames a table with an optional header and an inset table region so borders breathe.",
		preview: (
			<DataTableCard title="Orders" description="Recent activity" className="w-full">
				<MiniTable />
			</DataTableCard>
		),
		examples: [
			{
				title: "With header & actions",
				node: (
					<DataTableCard
						title="Orders"
						description="3 of 1,284 orders"
						actions={<Button size="sm" variant="ghost">Export</Button>}
					>
						<MiniTable />
					</DataTableCard>
				),
			},
		],
	},
	{
		slug: "tabs",
		name: "Tabs",
		tag: "shadcn",
		description: "Segmented and underline tab styles. Underline reads clearly on any surface.",
		preview: (
			<Tabs defaultValue="all">
				<TabsList variant="line">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="mine">Mine</TabsTrigger>
				</TabsList>
			</Tabs>
		),
		examples: [
			{
				title: "Line",
				node: (
					<Tabs defaultValue="all">
						<TabsList variant="line">
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="mine">My orders</TabsTrigger>
							<TabsTrigger value="archived">Archived</TabsTrigger>
						</TabsList>
					</Tabs>
				),
			},
			{
				title: "Segmented",
				node: (
					<Tabs defaultValue="all">
						<TabsList>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="mine">My orders</TabsTrigger>
						</TabsList>
					</Tabs>
				),
			},
		],
	},
	{
		slug: "item",
		name: "Item",
		tag: "shadcn",
		description: "List row primitive: media + title + description + actions, with inset separators.",
		preview: (
			<Card className="w-full overflow-hidden py-0">
				<ItemGroup>
					<DemoItem icon={<PackageIcon />} title="#3102 · Astrid" desc="3 items · $1,290" />
				</ItemGroup>
			</Card>
		),
		examples: [
			{
				title: "Group with inset dividers",
				node: (
					<Card className="overflow-hidden py-0">
						<ItemGroup>
							<DemoItem icon={<PackageIcon />} title="#3102 · Astrid Lindqvist" desc="3 items · Ships Jun 20" status="Processing" />
							<ItemSeparator className="mx-4 data-horizontal:w-auto" />
							<DemoItem icon={<TruckIcon />} title="#3100 · Yuki Tanaka" desc="5 items · Ready to ship" status="Packed" />
							<ItemSeparator className="mx-4 data-horizontal:w-auto" />
							<DemoItem icon={<ReceiptIcon />} title="#3096 · Sam Whitfield" desc="1 item · Payment review" status="On hold" />
						</ItemGroup>
					</Card>
				),
			},
		],
	},
	{
		slug: "card",
		name: "Card",
		tag: "shadcn",
		description: "Raised surface (lighter card lightness + soft shadow, no outline ring).",
		preview: (
			<Card className="w-full" size="sm">
				<CardHeader>
					<CardTitle>Card title</CardTitle>
					<CardDescription>Supporting description text.</CardDescription>
				</CardHeader>
			</Card>
		),
		examples: [
			{
				title: "Header + content",
				node: (
					<Card className="max-w-sm">
						<CardHeader>
							<CardTitle>Smarter shipping</CardTitle>
							<CardDescription>Real-time rates at checkout.</CardDescription>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Cards rely on surface lightness and a soft shadow instead of a border.
						</CardContent>
					</Card>
				),
			},
		],
	},
	{
		slug: "separator",
		name: "Separator / Inset",
		tag: "shadcn",
		description: "Hairline divider. Inset variant respects component padding to leave room to breathe.",
		preview: (
			<div className="w-full rounded-2xl bg-card py-3 shadow-soft">
				<p className="px-4 pb-2 text-sm">Section one</p>
				<Separator className="mx-4 data-horizontal:w-auto" />
				<p className="px-4 pt-2 text-sm">Section two</p>
			</div>
		),
		examples: [
			{
				title: "Full-bleed vs inset",
				node: (
					<div className="space-y-6">
						<div className="rounded-2xl bg-card py-3 shadow-soft">
							<p className="px-4 pb-2 text-sm text-muted-foreground">Full-bleed</p>
							<Separator />
							<p className="px-4 pt-2 text-sm text-muted-foreground">Runs edge to edge</p>
						</div>
						<div className="rounded-2xl bg-card py-3 shadow-soft">
							<p className="px-4 pb-2 text-sm text-muted-foreground">Inset (mx-4)</p>
							<Separator className="mx-4 data-horizontal:w-auto" />
							<p className="px-4 pt-2 text-sm text-muted-foreground">Respects padding</p>
						</div>
					</div>
				),
			},
		],
	},
];

export function getShowcaseEntry(slug: string) {
	return showcase.find((e) => e.slug === slug);
}

// where each component is consumed — components and/or pages
export const usedIn: Record<ShowcaseSlug, string[]> = {
	button: ["Sidebar", "Orders", "Overview", "DataTableCard"],
	badge: ["Orders", "Overview", "Item"],
	delta: ["Kpi", "Dashboard"],
	avatar: ["Orders"],
	kpi: ["Overview", "Dashboard", "Orders"],
	"mini-chart": ["Kpi", "Overview"],
	bento: ["Overview", "Dashboard", "Orders"],
	"data-table-card": ["Orders"],
	tabs: ["Overview"],
	item: ["Overview"],
	card: ["DataTableCard", "Kpi", "Components"],
	separator: ["BentoPanel", "Item"],
};

const pageRoutes: Record<string, string> = {
	Overview: "/overview",
	Dashboard: "/",
	Orders: "/orders",
	Components: "/components",
};

/** Resolve a "used in" label to a link (component detail or page), else null. */
export function usedInHref(label: string): string | null {
	if (pageRoutes[label]) return pageRoutes[label];
	const comp = showcase.find((e) => e.name === label || e.name.startsWith(label));
	return comp ? `/components/${comp.slug}` : null;
}

// ----------------------------------------------------------------- demo helpers
function MiniTable() {
	const rows = [
		{ id: "#3102", name: "Astrid Lindqvist", total: "$1,290.00", status: "Processing" as const },
		{ id: "#3100", name: "Yuki Tanaka", total: "$2,340.00", status: "Fulfilled" as const },
		{ id: "#3096", name: "Sam Whitfield", total: "$215.00", status: "Pending" as const },
	];
	const variant: Record<string, "secondary" | "outline" | "destructive"> = {
		Fulfilled: "secondary",
		Processing: "outline",
		Pending: "outline",
	};
	return (
		<Table className="border-t">
			<TableHeader>
				<TableRow>
					<TableHead className="pl-0">Order</TableHead>
					<TableHead>Customer</TableHead>
					<TableHead className="text-right">Total</TableHead>
					<TableHead className="pr-0 text-right">Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((r) => (
					<TableRow key={r.id} className="h-12">
						<TableCell className="pl-0 font-medium tabular-nums">{r.id}</TableCell>
						<TableCell>{r.name}</TableCell>
						<TableCell className="text-right tabular-nums">{r.total}</TableCell>
						<TableCell className="pr-0 text-right">
							<Badge variant={variant[r.status]}>{r.status}</Badge>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function DemoItem({
	icon,
	title,
	desc,
	status,
}: {
	icon: React.ReactNode;
	title: string;
	desc: string;
	status?: string;
}) {
	return (
		<Item>
			<ItemMedia variant="icon" className="rounded-full border-0">
				{icon}
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{title}</ItemTitle>
				<ItemDescription>{desc}</ItemDescription>
			</ItemContent>
			{status ? (
				<ItemActions>
					<Badge variant="outline">{status}</Badge>
				</ItemActions>
			) : null}
		</Item>
	);
}
