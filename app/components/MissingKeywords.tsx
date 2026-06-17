type Priority = "high" | "medium" | "low";

const PRIORITY_STYLES: Record<
  Priority,
  { dot: string; badge: string; label: string }
> = {
  high: {
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 border-red-200",
    label: "High",
  },
  medium: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Medium",
  },
  low: {
    dot: "bg-gray-300",
    badge: "bg-gray-50 text-gray-500 border-gray-200",
    label: "Low",
  },
};

function getPriority(index: number, total: number): Priority {
  const third = Math.ceil(total / 3);
  if (index < third) return "high";
  if (index < third * 2) return "medium";
  return "low";
}

export default function MissingKeywords({ list }: { list: string[] }) {
  if (!list?.length) return null;

  const high = list.filter((_, i) => getPriority(i, list.length) === "high");
  const medium = list.filter(
    (_, i) => getPriority(i, list.length) === "medium",
  );
  const low = list.filter((_, i) => getPriority(i, list.length) === "low");

  return (
    <div className="space-y-5">
      {/* Legend */}

      <div className="flex items-center gap-5">
        {(["high", "medium", "low"] as Priority[]).map((p) => (
          <span
            key={p}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            <span
              className={`w-2 h-2 rounded-full ${PRIORITY_STYLES[p].dot}`}
            />
            {PRIORITY_STYLES[p].label}
          </span>
        ))}
      </div>

      {/* Groups */}
      {(
        [
          ["high", high],
          ["medium", medium],
          ["low", low],
        ] as [Priority, string[]][]
      )
        .filter(([, items]) => items.length > 0)
        .map(([priority, items]) => (
          <div key={priority}>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">
              {PRIORITY_STYLES[priority].label} priority
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((kw) => (
                <span
                  key={kw}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${PRIORITY_STYLES[priority].badge}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${PRIORITY_STYLES[priority].dot}`}
                  />
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ))}

      {/* Tip */}
      <p className="text-xs text-gray-400 pt-1">
        Weave high-priority terms naturally into your experience bullets for the
        best ATS lift.
      </p>
    </div>
  );
}
