export default function InputPanel({
  title,
  icon,
  placeholder,
  value,
  onChange,
  maxLength,
  badge,
  footer,
}: {
  title: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {title}
        </div>
        {badge}
      </div>
      <textarea
        className="flex-1 min-h-[200px] px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      />
      {footer && (
        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
          {footer}
          <span className="text-[11px] text-gray-300">
            {value.length.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
