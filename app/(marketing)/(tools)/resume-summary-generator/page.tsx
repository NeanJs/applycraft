import ToolSeoContent from "@/app/components/seo/ToolsSEOContent";
import ResumeSummaryPage from "@/app/components/tools/summary-generator/SummeryGenerator";
import { toolSEO } from "@/app/lib/seo/tools";

export default function Page() {
  return (
    <>
      <ResumeSummaryPage />
      <ToolSeoContent {...toolSEO["resume-summary-generator"]} />
    </>
  );
}
