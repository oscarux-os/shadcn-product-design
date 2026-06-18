import { DashboardInvoices } from "@/components/dashboard-invoices";
import { SalesChart } from "@/components/sales-chart";
import { DashboardStats } from "@/components/stats";
import { BentoPanel } from "@/components/ui/bento";

export function Dashboard() {
	return (
		<div className="flex flex-1 flex-col gap-6">
			<h1 className="font-medium text-xl leading-tight">Dashboard</h1>

			<BentoPanel>
				<DashboardStats />
				<SalesChart />
				<DashboardInvoices />
			</BentoPanel>
		</div>
	);
}
