import ResumeTemplate from "@/app/template/resume-template";
import { ResumeData } from "@/app/types/types";

export default function PrintPage() {
  return (
    <div id="resume-template">
      <ResumeTemplate resumeData={resumeData} />
    </div>
  );
}
