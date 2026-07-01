import { Suspense } from "react";
import { Leaderboard } from "@/components/leaderboard";

export default function Home() {
  return (
    <main className="flex-1">
      <Suspense>
        <Leaderboard />
      </Suspense>
    </main>
  );
}
