import { BentoRow } from "@/components/ui/bento";
import { Kpi } from "@/components/ui/kpi";

const stats = [
	{ label: "Active users", value: "847", delta: 3.1 },
	{ label: "Revenue", value: "$18,290", delta: 12.4 },
	{ label: "Conversion Rate", value: "3.28%", delta: -0.4 },
];

export function DashboardStats() {
	return (
		<BentoRow>
			{stats.map((s) => (
				<Kpi key={s.label} label={s.label} value={s.value} delta={s.delta} />
			))}
		</BentoRow>
	);
}
