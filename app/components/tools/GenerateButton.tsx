"use client";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  label?: string;
  loadingLabel?: string;
}

export default function GenerateButton({
  onClick,
  disabled,
  loading,
  label = "Optimize resume →",
  loadingLabel = "Generating…",
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all mb-4 ${
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
  );
}
