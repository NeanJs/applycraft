import { ATSOnlyResult } from "@/app/types/tailor";
import ATSBreakdownCard from "./ATSBreakdownCard";
import ATSInsightsCard from "./ATSInsights";
import ATSScoreCard from "./ATSScoreCard";
import MissingKeywords from "./MissingKeywords";

export function ATSResults({ result }: { result: ATSOnlyResult }) {
  return (
    <div className="space-y-6">
      <ATSScoreCard atsScore={result.atsScore} />
      <ATSBreakdownCard breakdown={result.breakdown} />
      <section className="px-8 py-7 border-b border-gray-100 bg-white">
        <p className="text-[10px] uppercase text-gray-400">Skill gaps</p>
        <h2 className="text-sm font-semibold mb-4 text-gray-600">
          Missing Keywords
        </h2>
        <MissingKeywords list={result.keywordAnalysis.missingKeywords} />
      </section>
      <ATSInsightsCard insights={result.insights} />
    </div>
  );
}
