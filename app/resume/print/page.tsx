import ResumeTemplate from "@/app/template/resume-template";

export default async function PrintPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const sp = await searchParams;
  const data = sp?.data;

  console.log("RAW DATA:", data);

  if (!data) {
    return <div>No resume data found</div>;
  }

  const resumeData = JSON.parse(data);

  return (
    <div id="resume-template">
      <ResumeTemplate resumeData={resumeData} />
    </div>
  );
}
