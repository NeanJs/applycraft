import { ATSOnlyBreakdown } from "@/app/types/tailor";

type ATSBreakdownCardProps = {
  breakdown: ATSOnlyBreakdown;
};
const BREAKDOWN_META: Record<
  keyof ATSOnlyBreakdown,
  { label: string; description: string }
> = {
  structure: {
    label: "Structure",
    description: "Formatting and ATS readability",
  },

  roleMatch: {
    label: "Role Match",
    description: "Alignment with the target role",
  },

  keywordMatch: {
    label: "Keyword Coverage",
    description: "Relevant keywords found in your resume",
  },
  readability: {
    label: "Readability",
    description: "Clarity and quality of bullet points",
  },
};
function ATSBreakdownCard({ breakdown }: ATSBreakdownCardProps) {
  return (
    breakdown && (
      <>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-400">
            Score breakdown
          </p>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="flex flex-col gap-3">
          {(Object.keys(BREAKDOWN_META) as (keyof ATSOnlyBreakdown)[]).map(
            (key) => (
              <BreakdownRow
                key={key}
                label={BREAKDOWN_META[key].label}
                description={BREAKDOWN_META[key].description}
                value={breakdown[key]}
              />
            ),
          )}
        </div>
      </>
    )
  );
}

export default ATSBreakdownCard;
function BreakdownRow({
  label,
  description,
  value,
}: {
  label: string;
  description: string;
  value: number;
}) {
  const pct = Math.round(value);
  const color =
    pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  const textColor =
    pct >= 75
      ? "text-emerald-600"
      : pct >= 50
        ? "text-amber-500"
        : "text-red-500";

  return (
    <div className="flex items-center gap-4">
      <div className="w-32 shrink-0">
        <p className="text-xs font-medium text-gray-700">{label}</p>
        <p className="text-[11px] text-gray-400 leading-tight">{description}</p>
      </div>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`text-xs font-semibold tabular-nums w-8 text-right ${textColor}`}
      >
        {pct}%
      </span>
    </div>
  );
}
