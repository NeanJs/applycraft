"use client";

interface QuickStartSamplesProps {
  onTrySample: () => void;
  onClear: () => void;
  hasInput: boolean;
  loading?: boolean;
}

export default function QuickStartSamples({
  onTrySample,
  onClear,
  hasInput,
  loading = false,
}: QuickStartSamplesProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
      <p className="text-xs text-gray-600">
        No resume handy? Try a fictional sample. Replace its details before using any results.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        {hasInput && (
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:text-gray-800 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Clear
          </button>
        )}
        <button
          type="button"
          onClick={onTrySample}
          disabled={loading}
          className="text-xs font-medium text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 hover:border-gray-400 bg-white transition-colors disabled:opacity-50"
        >
          Try sample data
        </button>
      </div>
    </div>
  );
}
