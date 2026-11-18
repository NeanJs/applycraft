import type { JobRequirement } from "@/app/lib/ai/quality";

const STATUS_LABELS: Record<JobRequirement["status"], string> = {
  strong_match: "Strong match",
  partial_match: "Partial match",
  missing_evidence: "Missing evidence",
  not_applicable: "Not applicable",
};

const STATUS_STYLES: Record<JobRequirement["status"], string> = {
  strong_match: "bg-emerald-50 text-emerald-700",
  partial_match: "bg-amber-50 text-amber-700",
  missing_evidence: "bg-red-50 text-red-700",
  not_applicable: "bg-gray-100 text-gray-600",
};

export default function JobRequirementsList({
  requirements,
}: {
  requirements: JobRequirement[];
}) {
  if (!requirements.length) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-400">
        Job description analysis
      </p>
      <h2 className="mb-4 text-sm font-semibold text-gray-700">
        Requirement coverage
      </h2>
      <ul className="space-y-4">
        {requirements.map((item) => (
          <li
            key={`${item.requirement}-${item.category}`}
            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-800">
                {item.requirement}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                {item.importance}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLES[item.status]}`}
              >
                {STATUS_LABELS[item.status]}
              </span>
            </div>
            <p className="mt-1 text-xs capitalize text-gray-400">
              {item.category.replaceAll("_", " ")}
            </p>
            {item.supportingEvidence && (
              <p className="mt-2 border-l-2 border-emerald-200 pl-3 text-xs leading-relaxed text-gray-600">
                Resume evidence: &ldquo;{item.supportingEvidence}&rdquo;
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
