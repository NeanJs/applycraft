export default function JobMetadata({
  jobTitle,
  companyName,
}: {
  jobTitle?: string;
  companyName?: string;
}) {
  if (!jobTitle && !companyName) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 my-4">
      <div className="flex items-start gap-3">
        {/* Company icon placeholder */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
          <span className="text-sm font-semibold">
            {companyName?.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Target Role
          </p>

          {jobTitle && (
            <h2 className="mt-1 text-base font-semibold text-gray-900">
              {jobTitle}
            </h2>
          )}

          {companyName && (
            <p className="mt-1 text-sm text-gray-500">{companyName}</p>
          )}
        </div>
      </div>
    </div>
  );
}
