"use client";

import Link from "next/link";

import { showcase, usedIn } from "@/components/showcase/registry";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function ShowcaseIndex() {
	return (
		<div className="flex flex-1 flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-medium text-xl leading-tight">Components</h1>
				<p className="text-sm text-muted-foreground">
					The shared building blocks used across the app, on the OKLCH design system.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{showcase.map((e) => (
					<Link className="group" href={`/components/${e.slug}`} key={e.slug}>
						<Card className="h-full gap-4 transition-transform group-hover:-translate-y-0.5">
							<CardHeader>
								<div className="flex items-center justify-between gap-2">
									<CardTitle className="text-base">{e.name}</CardTitle>
									<Badge className="text-xs uppercase tracking-wide" variant="outline">
										{e.tag}
									</Badge>
								</div>
								<CardDescription className="line-clamp-2">{e.description}</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-3">
								<div className="flex min-h-28 items-center justify-center rounded-xl bg-background p-4">
									{e.preview}
								</div>
								{usedIn[e.slug]?.length ? (
									<div className="flex flex-wrap items-center gap-1.5">
										<span className="text-muted-foreground text-xs">Used in</span>
										{usedIn[e.slug].map((u) => (
											<Badge className="text-xs" key={u} variant="secondary">
												{u}
											</Badge>
										))}
									</div>
								) : null}
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
