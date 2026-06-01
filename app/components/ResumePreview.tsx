import ResumeTemplate from "@/app/template/resume-template";
import { ResumeData } from "@/app/types/types";

export default function ResumePreview({
  responseData,
}: {
  responseData: ResumeData;
}) {
  return (
    <div style={{ background: "white", color: "black" }}>
      <ResumeTemplate resumeData={responseData} />
    </div>
  );
}
