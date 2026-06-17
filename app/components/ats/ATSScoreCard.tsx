import { ATSOnlyResult } from "@/app/types/tailor";

type ATSScoreCardProps = {
  atsScore: ATSOnlyResult["atsScore"];
};

export default function ATSScoreCard({ atsScore }: ATSScoreCardProps) {
  const status =
    atsScore >= 80
      ? "Excellent Match"
      : atsScore >= 60
        ? "Good Match"
        : atsScore >= 40
          ? "Needs Improvement"
          : "Poor Match";

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
        ATS Score
      </p>

      <div className="mt-4 flex items-end gap-3">
        <span className={`text-5xl font-bold ${scoreColor}`}>{atsScore}%</span>

        <span className={`pb-2 text-sm font-medium ${scoreColor}`}>
          {status}
        </span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${atsScore}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        This score estimates how well your resume aligns with the target job
        description based on keyword coverage, role relevance, and ATS-friendly
        structure.
      </p>
    </div>
  );
}
