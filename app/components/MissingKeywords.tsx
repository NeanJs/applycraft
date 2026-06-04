export default function MissingKeywords({ list }: { list: string[] }) {
  return (
    <section className="px-8 py-7 border-b border-gray-200">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Missing Keywords
      </h2>
      <div className="flex flex-wrap gap-2">
        {list?.map((kw: string, i: number) => (
          <span
            key={i}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 bg-white"
          >
            {kw}
          </span>
        ))}
      </div>
    </section>
  );
}
