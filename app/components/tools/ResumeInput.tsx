"use client";

import React from "react";
import { FileText } from "lucide-react";
import InputPanel from "../inputs/InputPanel";

interface ResumeInputProps {
  value: string;
  onChange: (v: string) => void;
  uploadingPdf?: boolean;
  onPdfUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

export default function ResumeInput({
  value,
  onChange,
  uploadingPdf = false,
  onPdfUpload,
  maxLength = 5000,
}: ResumeInputProps) {
  const hasResume = value.trim().length > 0;

  return (
    <InputPanel
      title="Your resume"
      icon={<FileText size={14} />}
      placeholder="Paste your current resume here..."
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      badge={
        hasResume ? (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            ready
          </span>
        ) : null
      }
      footer={
        onPdfUpload ? (
          <label className="text-[11px] text-gray-400 flex items-center gap-1 cursor-pointer hover:text-gray-600 transition-colors">
            {uploadingPdf ? (
              <>
                <span className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                Parsing PDF...
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2v8m0 0l-3-3m3 3l3-3M2 13h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Upload PDF instead
              </>
            )}

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={onPdfUpload}
              disabled={uploadingPdf}
            />
          </label>
        ) : null
      }
    />
  );
}
// "use client";

// import React from "react";

// interface ResumeInputProps {
//   value: string;
//   onChange: (v: string) => void;
//   uploadingPdf?: boolean;
//   onPdfUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   maxLength?: number;
// }

// export default function ResumeInput({
//   value,
//   onChange,
//   uploadingPdf = false,
//   onPdfUpload,
//   maxLength = 5000,
// }: ResumeInputProps) {
//   const hasResume = value.trim().length > 0;

//   return (
//     <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white">
//       {/* Header */}
//       <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
//         <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
//           <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//             <path
//               d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z"
//               stroke="currentColor"
//               strokeWidth="1.25"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M9 1v5h5M5 9h6M5 11.5h4"
//               stroke="currentColor"
//               strokeWidth="1.25"
//               strokeLinecap="round"
//             />
//           </svg>
//           Your resume
//         </div>
//         {hasResume ? (
//           <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
//             ready
//           </span>
//         ) : (
//           <span className="text-[11px] text-gray-300">
//             {value.length} / {maxLength.toLocaleString()}
//           </span>
//         )}
//       </div>

//       {/* Textarea */}
//       <textarea
//         className="flex-1 min-h-[200px] px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
//         placeholder="Paste your current resume here…"
//         value={value}
//         onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
//       />

//       {/* Footer: PDF upload */}
//       {onPdfUpload && (
//         <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
//           <label className="text-[11px] text-gray-400 flex items-center gap-1 cursor-pointer hover:text-gray-600 transition-colors">
//             {uploadingPdf ? (
//               <>
//                 <span className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
//                 Parsing PDF…
//               </>
//             ) : (
//               <>
//                 <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
//                   <path
//                     d="M8 2v8m0 0l-3-3m3 3l3-3M2 13h12"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 Upload PDF instead
//               </>
//             )}
//             <input
//               type="file"
//               accept=".pdf"
//               className="hidden"
//               onChange={onPdfUpload}
//               disabled={uploadingPdf}
//             />
//           </label>
//           <span className="text-[11px] text-gray-300">
//             {value.length.toLocaleString()} / {maxLength.toLocaleString()}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }
