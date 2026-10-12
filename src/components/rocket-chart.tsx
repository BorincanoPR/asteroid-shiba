import { useRef } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type ChartPoint = { x: number; y: number };

type Props = {
  points: ChartPoint[];
  xDomain: [number, number];
  yDomain: [number, number];
  formatX: (x: number) => string;
  formatY: (y: number) => string;
  curve?: "linear" | "monotone";
};

type DotProps = { cx?: number; cy?: number; index?: number };

export function RocketChart({
  points,
  xDomain,
  yDomain,
  formatX,
  formatY,
  curve = "linear",
}: Props) {
  const prev = useRef<{ cx: number; cy: number } | null>(null);
  const last = points.length - 1;

  if (points.length === 0) {
    return (
      <div className="grid h-full place-items-center font-display tracking-widest text-steel">
        SIN TELEMETRÍA
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="x"
          type="number"
          domain={xDomain}
          tickCount={4}
          tickFormatter={formatX}
          stroke="var(--color-line)"
          tick={{ fill: "var(--color-steel)", fontSize: 12, fontFamily: "var(--font-display)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={yDomain}
          tickCount={4}
          tickFormatter={formatY}
          stroke="var(--color-line)"
          tick={{ fill: "var(--color-steel)", fontSize: 12, fontFamily: "var(--font-display)" }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          cursor={{ stroke: "var(--color-line)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const row = payload[0].payload as ChartPoint;
            return (
              <div className="border border-signal/40 bg-void px-3 py-2 font-display tracking-wide text-frost">
                <div className="text-steel">{formatX(row.x)}</div>
                <div className="text-lg">{formatY(row.y)}</div>
              </div>
            );
          }}
        />
        <Area
          type={curve}
          dataKey="y"
          stroke="var(--color-signal)"
          strokeWidth={2}
          fill="var(--color-signal)"
          fillOpacity={0.08}
          isAnimationActive={false}
          activeDot={false}
          dot={(raw) => {
            const p = raw as DotProps;
            const key = p.index ?? 0;
            if (p.cx == null || p.cy == null || p.index == null) return <g key={key} />;
            if (p.index === last - 1) prev.current = { cx: p.cx, cy: p.cy };
            if (p.index !== last) return <g key={key} />;
            const earlier = prev.current;
            const dx = earlier ? p.cx - earlier.cx : 0;
            const dy = earlier ? p.cy - earlier.cy : -1;
            const rot = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
            return (
              <g key={key} transform={`translate(${p.cx} ${p.cy}) rotate(${rot})`}>
                <path d="M0 -13 L5 -2 L4 8 L0 12 L-4 8 L-5 -2 Z" fill="var(--color-signal)" />
                <path d="M-4 4 L-10 11 L-3 7" fill="var(--color-signal)" />
                <path d="M4 4 L10 11 L3 7" fill="var(--color-signal)" />
                <circle cx="0" cy="-2" r="1.6" fill="var(--color-void)" />
              </g>
            );
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
