export default function MissingKeywords({ list }: { list: string[] }) {
  if (!list?.length) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {list.map((kw) => (
          <span
            key={kw}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600"
          >
            {kw}
          </span>
        ))}
      </div>
      <p className="pt-3 text-xs text-gray-400">
        These terms lack direct resume evidence. Add them only if they reflect
        experience you can verify.
      </p>
    </div>
  );
}
