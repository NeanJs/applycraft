type ResumeInsightProps = {
  resumes: {
    atsBefore: number;
    atsAfter: number;
  }[];
};

export default function ResumeInsights({ resumes }: ResumeInsightProps) {
  if (!resumes.length) return null;

  const averageBefore = Math.round(
    resumes.reduce((acc, r) => acc + r.atsBefore, 0) / resumes.length,
  );

  const averageAfter = Math.round(
    resumes.reduce((acc, r) => acc + r.atsAfter, 0) / resumes.length,
  );

  const improvement = averageAfter - averageBefore;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div className="bg-white border border-zinc-200 rounded-2xl p-5">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          Resumes Optimized
        </p>

        <p className="text-3xl font-semibold mt-3">{resumes.length}</p>
      </div>
      <div className="bg-white border border-zinc-200 rounded-2xl p-5">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          Average estimated match
        </p>

        <div className="flex items-end gap-2 mt-3">
          <span className="text-3xl font-semibold">{averageAfter}%</span>

          <span className="text-sm text-emerald-600 mb-1">
            {improvement > 0 ? "+" : ""}
            {improvement}%
          </span>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5">
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          Average starting estimate
        </p>

        <p className="text-3xl font-semibold mt-3">{averageBefore}%</p>
      </div>
    </div>
  );
}
