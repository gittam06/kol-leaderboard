"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, CircleDot, Target, TrendingUp } from "lucide-react";
import { PageHeader, PageShell } from "@/components/page-header";
import { ErrorState } from "@/components/leaderboard-states";
import { Skeleton } from "@/components/ui/skeleton";
import { CountUp, fadeUpItem, staggerContainer } from "@/components/motion";
import { useAsync } from "@/components/use-async";
import { fetchSignalFeed } from "@/lib/data";
import { computeAnalytics, type CategoryDatum } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  OPEN: "var(--open)",
  TARGET_HIT: "var(--gain)",
  STOPLOSS_HIT: "var(--loss)",
  EXPIRED: "var(--warn)",
};

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: { value: number; payload: { label?: string } }[];
  label?: string | number;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-muted-foreground">
        {point.payload.label ?? label}
      </div>
      <div className="num mt-0.5 font-semibold text-foreground">
        {point.value}
        {suffix}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUpItem} className="glass rounded-xl p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="w-full">{children}</div>
    </motion.div>
  );
}

function ChartBox({ children }: { children: React.ReactNode }) {
  return <div className="h-[240px] w-full">{children}</div>;
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[320px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const { status, data, error, reload } = useAsync(fetchSignalFeed);
  const summary = useMemo(
    () => (data ? computeAnalytics(data) : null),
    [data],
  );

  const metrics = summary
    ? [
        {
          label: "Total signals",
          icon: Activity,
          value: summary.total,
          suffix: "",
          decimals: 0,
          tone: "default" as const,
        },
        {
          label: "Win rate",
          icon: Target,
          value: summary.winRate,
          suffix: "%",
          decimals: 1,
          tone: "gain" as const,
        },
        {
          label: "Open now",
          icon: CircleDot,
          value: summary.open,
          suffix: "",
          decimals: 0,
          tone: "default" as const,
        },
        {
          label: "Avg ROI",
          icon: TrendingUp,
          value: summary.avgRoi,
          suffix: "%",
          decimals: 1,
          tone:
            summary.avgRoi > 0
              ? ("gain" as const)
              : ("loss" as const),
        },
      ]
    : [];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Aggregate view"
        title="Analytics"
        subtitle="How the whole signal set behaves: outcomes, cadence, ROI spread, and the most-called markets."
      />

      <div className="mt-8">
        {status === "loading" && <AnalyticsSkeleton />}

        {status === "error" && (
          <ErrorState
            message={error ?? "Something went wrong."}
            onRetry={reload}
          />
        )}

        {status === "ready" && summary && (
          <div className="space-y-6">
            <motion.dl
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3 lg:grid-cols-4"
            >
              {metrics.map((m) => {
                const Icon = m.icon;
                const tone =
                  m.tone === "gain"
                    ? "text-[var(--gain)]"
                    : m.tone === "loss"
                      ? "text-[var(--loss)]"
                      : "text-foreground";
                return (
                  <motion.div
                    key={m.label}
                    variants={fadeUpItem}
                    className="glass rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                        <Icon className="size-3.5" aria-hidden />
                      </span>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {m.label}
                      </dt>
                    </div>
                    <dd
                      className={cn(
                        "num mt-3 text-2xl font-semibold tabular-nums",
                        tone,
                      )}
                    >
                      <CountUp
                        value={m.value}
                        decimals={m.decimals}
                        suffix={m.suffix}
                      />
                    </dd>
                  </motion.div>
                );
              })}
            </motion.dl>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-4 lg:grid-cols-2"
            >
              <ChartCard title="Outcomes" hint="Distribution of signal status">
                <div className="h-[196px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.statusBreakdown}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={54}
                        outerRadius={84}
                        paddingAngle={2}
                        stroke="transparent"
                      >
                        {summary.statusBreakdown.map((d) => (
                          <Cell key={d.key} fill={STATUS_COLOR[d.key]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} cursor={false} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <StatusLegend data={summary.statusBreakdown} />
              </ChartCard>

              <ChartCard
                title="Signal cadence"
                hint="New signals published per day"
              >
                <ChartBox>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summary.perDay}>
                    <defs>
                      <linearGradient id="cadence" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="var(--primary)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={24}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      width={24}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={false} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#cadence)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                </ChartBox>
              </ChartCard>

              <ChartCard
                title="Most-called markets"
                hint="Top symbols by signal count"
              >
                <ChartBox>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={summary.topSymbols}
                    layout="vertical"
                    margin={{ left: 8 }}
                  >
                    <XAxis type="number" hide allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      width={56}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={false} />
                    <Bar
                      dataKey="value"
                      fill="var(--primary)"
                      radius={[0, 4, 4, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
                </ChartBox>
              </ChartCard>

              <ChartCard
                title="ROI distribution"
                hint="How signal returns are spread"
              >
                <ChartBox>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.roiBuckets}>
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      width={24}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={false} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                      {summary.roiBuckets.map((d, i) => (
                        <Cell
                          key={d.key}
                          fill={i < 3 ? "var(--loss)" : "var(--gain)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                </ChartBox>
              </ChartCard>
            </motion.div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function StatusLegend({ data }: { data: CategoryDatum[] }) {
  return (
    <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
      {data.map((d) => (
        <li key={d.key} className="flex items-center gap-1.5 text-xs">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: STATUS_COLOR[d.key] }}
            aria-hidden
          />
          <span className="text-muted-foreground">{d.label}</span>
          <span className="num font-medium text-foreground">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}
