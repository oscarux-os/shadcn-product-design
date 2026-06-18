"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { navLinks } from "@/components/app-shared";
import { NavUser } from "@/components/nav-user";
import { BellIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";

function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	return (
		<Button
			aria-label="Toggle theme"
			size="icon"
			variant="ghost"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			<MoonIcon className="dark:hidden" />
			<SunIcon className="hidden dark:block" />
		</Button>
	);
}

export function AppHeader() {
	const pathname = usePathname();
	const activeItem =
		navLinks.find((item) => item.path === pathname) ??
		navLinks.find(
			(item) => item.path && item.path !== "/" && pathname.startsWith(item.path)
		) ??
		navLinks.find((item) => item.path === "/overview");

	return (
		<header
			className={cn(
				"pxx-4 mb-6 flex items-center justify-between gap-2 md:px-2"
			)}
		>
			<div className="flex items-center gap-3">
				<CustomSidebarTrigger />
				<Separator
					className="mr-2 h-4 data-[orientation=vertical]:self-center"
					orientation="vertical"
				/>
				<AppBreadcrumbs page={activeItem} />
			</div>
			<div className="flex items-center gap-3">
				<ThemeToggle />
				<Button aria-label="Notifications" size="icon" variant="ghost">
					<BellIcon
					/>
				</Button>
				<Separator
					className="h-4 data-[orientation=vertical]:self-center"
					orientation="vertical"
				/>
				<NavUser />
			</div>
		</header>
	);
}
