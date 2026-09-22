export type Point = { label: string; value: number | null };

function niceBounds(values: number[]) {
  const nums = values.filter((v) => Number.isFinite(v));
  if (!nums.length) return { min: 0, max: 1 };
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const pad = (max - min) * 0.12;
  return { min: min - pad, max: max + pad };
}

export function LineChartMini({
  data,
  tone = "primary",
  unit = "",
}: {
  data: Point[];
  tone?: "primary" | "accent" | "sleep";
  unit?: string;
}) {
  const pts = data.filter((d) => d.value !== null) as { label: string; value: number }[];
  if (pts.length < 2) {
    return (
      <div className="grid h-40 place-items-center text-sm text-muted-foreground">
        Not enough data yet
      </div>
    );
  }
  const { min, max } = niceBounds(pts.map((p) => p.value));
  const w = 320;
  const h = 140;
  const x = (i: number) => (i / (pts.length - 1)) * (w - 16) + 8;
  const y = (v: number) => h - 12 - ((v - min) / (max - min)) * (h - 28);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ");
  const area = `${d} L${x(pts.length - 1)},${h} L${x(0)},${h} Z`;
  const stroke = { primary: "stroke-primary", accent: "stroke-accent", sleep: "stroke-sleep" }[tone];
  const fill = { primary: "fill-primary/12", accent: "fill-accent/12", sleep: "fill-sleep/12" }[tone];

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" preserveAspectRatio="none">
        <path d={area} className={fill} />
        <path d={d} fill="none" strokeWidth="2.5" className={stroke} strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.value)} r="2.5" className="fill-card stroke-primary" />
        ))}
      </svg>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>
          {pts[0].label} · {round(pts[0].value)}
          {unit}
        </span>
        <span>
          {pts[pts.length - 1].label} · {round(pts[pts.length - 1].value)}
          {unit}
        </span>
      </div>
    </div>
  );
}

export function BarChartMini({
  data,
  goal,
  tone = "primary",
}: {
  data: Point[];
  goal?: number;
  tone?: "primary" | "water" | "move" | "sleep" | "accent";
}) {
  const values = data.map((d) => d.value ?? 0);
  const max = Math.max(goal ?? 0, ...values, 1);
  const bg = {
    primary: "bg-primary",
    water: "bg-water",
    move: "bg-move",
    sleep: "bg-sleep",
    accent: "bg-accent",
  }[tone];
  const step = Math.max(1, Math.ceil(data.length / 7));

  return (
    <div>
      <div className="relative flex h-36 items-end gap-[3px]">
        {goal ? (
          <div
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-muted-foreground/50"
            style={{ bottom: `${(goal / max) * 100}%` }}
          />
        ) : null}
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-muted"
            style={{ height: "100%", display: "flex", alignItems: "flex-end" }}
            title={`${d.label}: ${round(d.value ?? 0)}`}
          >
            <div
              className={`w-full rounded-t ${bg}`}
              style={{ height: `${Math.max(2, ((d.value ?? 0) / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        {data
          .filter((_, i) => i % step === 0)
          .map((d, i) => (
            <span key={i}>{d.label}</span>
          ))}
      </div>
    </div>
  );
}

export const round = (n: number) => Math.round(n * 10) / 10;
