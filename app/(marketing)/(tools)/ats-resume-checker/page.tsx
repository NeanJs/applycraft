import ToolSeoContent from "@/app/components/seo/ToolsSEOContent";
import AtsExtractorPage from "@/app/components/tools/ats-generator/ATSGeneratorPage";
import { toolSEO } from "@/app/lib/seo/tools";

export default function Page() {
  return (
    <>
      <AtsExtractorPage />
      <ToolSeoContent {...toolSEO["ats-resume-checker"]} />
    </>
  );
}
