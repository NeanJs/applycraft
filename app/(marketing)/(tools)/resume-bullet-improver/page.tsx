import ToolSeoContent from "@/app/components/seo/ToolsSEOContent";
import ImprovedBulletsPage from "@/app/components/tools/resume-bullet-improver/BulletsImprover";
import { toolSEO } from "@/app/lib/seo/tools";

export default function Page() {
  return (
    <>
      <ImprovedBulletsPage />
      <ToolSeoContent {...toolSEO["resume-bullet-improver"]} />
    </>
  );
}
