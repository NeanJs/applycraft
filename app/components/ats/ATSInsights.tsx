import { ATSOnlyResult } from "@/app/types/tailor";

type ATSInsightsCardProps = {
  insights: ATSOnlyResult["insights"];
};

export default function ATSInsightsCard({ insights }: ATSInsightsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="space-y-6">
        <InsightSection title="Strengths" items={insights.topStrengths} />

        <InsightSection title="Biggest Gaps" items={insights.biggestGaps} />

        <InsightSection title="Quick Wins" items={insights.quickWins} />
      </div>
    </div>
  );
}

function InsightSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-400">
          {title}
        </p>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-gray-700 leading-relaxed">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
