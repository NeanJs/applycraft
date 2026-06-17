// ResumeResultsSkeleton.tsx
export default function ResumeResultsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm animate-pulse">
      {/* Score */}
      <div className="px-8 py-8 border-b border-gray-100 flex items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-gray-100" />
        <div className="flex-1 space-y-3">
          <div className="h-3 bg-gray-100 rounded w-2/3" />
          <div className="h-2 bg-gray-100 rounded-full w-full" />
        </div>
      </div>
      {/* Resume */}
      <div className="px-8 py-7 border-b border-gray-100 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-24" />
        <div className="h-64 bg-gray-50 rounded-xl" />
      </div>
      {/* Keywords */}
      <div className="px-8 py-7 border-b border-gray-100 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-32" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-7 w-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
      {/* Cover letter */}
      <div className="px-8 py-7 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-28" />
        <div className="h-40 bg-gray-50 rounded-xl" />
      </div>
    </div>
  );
}
