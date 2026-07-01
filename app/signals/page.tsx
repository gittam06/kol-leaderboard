import { SignalsView } from "@/components/signals-view";

export const metadata = {
  title: "Signal Feed - SignalRank",
  description: "Every trading call across all tracked KOLs, newest first.",
};

export default function SignalsPage() {
  return (
    <main className="flex-1">
      <SignalsView />
    </main>
  );
}
