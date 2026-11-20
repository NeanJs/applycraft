"use client";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  label?: string;
  loadingLabel?: string;
  hint?: string;
}

export default function GenerateButton({
  onClick,
  disabled,
  loading,
  label = "Optimize resume →",
  loadingLabel = "Generating…",
  hint,
}: GenerateButtonProps) {
  return (
    <div className="mb-4">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all ${
          !disabled
            ? "bg-gray-900 text-white hover:bg-gray-700 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {loadingLabel}
          </span>
        ) : (
          label
        )}
      </button>
      {hint && <p className="mt-2 text-center text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
