export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-1.5">
      {children}
    </p>
  );
}
