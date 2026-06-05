export default function ResumeTemplateView({
  resumeData,
}: {
  resumeData: any;
}) {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <div>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          {resumeData?.name}
        </h1>

        <p style={{ fontSize: "16px", color: "#555" }}>{resumeData?.title}</p>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <div>
        <h2>Summary</h2>
        <p>{resumeData?.summary}</p>
      </div>

      <div>
        <h2>Experience</h2>
        {resumeData?.experience?.map((exp: any, i: number) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <strong>{exp.role}</strong> - {exp.company}
          </div>
        ))}
      </div>
    </div>
  );
}
