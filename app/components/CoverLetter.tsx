export default function CoverLetter({ text }: { text: string }) {
  return (
    <section className="px-8 py-7">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Cover Letter</h2>
      <div className="border border-gray-200 rounded-xl bg-gray-50 px-6 py-5 max-h-80 overflow-y-auto">
        <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed font-sans">
          {text}
        </pre>
      </div>
    </section>
  );
}
