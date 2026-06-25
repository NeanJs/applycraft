import ToolSeoContent from "@/app/components/seo/ToolsSEOContent";
import CoverLetterPage from "@/app/components/tools/coverletter-generator/CoverLetterGenerator";
import { toolSEO } from "@/app/lib/seo/tools";

export default function Page() {
  return (
    <>
      <CoverLetterPage />
      <ToolSeoContent {...toolSEO["cover-letter-generator"]} />
    </>
  );
}
