import ToolSeoContent from "@/app/components/seo/ToolsSEOContent";
import TailorPage from "@/app/components/tools/resume-tailor/TailorPage";
import { toolSEO } from "@/app/lib/seo/tools";

export default function Page() {
  return (
    <>
      <TailorPage />
      <ToolSeoContent {...toolSEO["resume-tailor"]}/>
    </>
  );
}
