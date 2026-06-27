export async function parseResumeFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/parse-resume", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data && data.text) return data.text;

  throw new Error(data?.message ?? "Could not parse resume PDF.");
}
