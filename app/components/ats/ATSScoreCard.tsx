import { ATSOnlyResult } from "@/app/types/tailor";

type ATSScoreCardProps = {
  atsScore: ATSOnlyResult["atsScore"];
};

export default function ATSScoreCard({ atsScore }: ATSScoreCardProps) {
  const scoreColor =
    atsScore >= 80
      ? "text-emerald-600"
      : atsScore >= 60
        ? "text-green-500"
        : atsScore >= 40
          ? "text-amber-500"
          : "text-red-500";

  const barColor =
    atsScore >= 80
      ? "bg-emerald-500"
      : atsScore >= 60
        ? "bg-green-500"
        : atsScore >= 40
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="text-xs uppercase tracking-wider text-gray-400">
        Estimated job match
      </p>

      <div className="mt-4 flex items-end gap-3">
        <span className={`text-5xl font-bold ${scoreColor}`}>{atsScore}%</span>

        <span className="pb-2 text-sm font-medium text-gray-600">estimate</span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${atsScore}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        This estimate weights required requirements twice as much as preferred
        ones. The total is 40% keyword coverage, 30% role match, 15% section
        structure, and 15% bullet length. It is not a score from an ATS and
        cannot predict screening or hiring outcomes.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-gray-400">
        A strong match means at least 75% of meaningful requirement terms appear
        in resume evidence; partial means some terms appear, and no evidence is
        a missing match. Requirement extraction is model-assisted.
      </p>
    </div>
  );
}
