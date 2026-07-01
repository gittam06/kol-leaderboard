import { AnalyticsView } from "@/components/analytics-view";

export const metadata = {
  title: "Analytics - SignalRank",
  description: "Aggregate signal outcomes, cadence, ROI spread, and top markets.",
};

export default function AnalyticsPage() {
  return (
    <main className="flex-1">
      <AnalyticsView />
    </main>
  );
}
