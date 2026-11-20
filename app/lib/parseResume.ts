export async function parseResumeFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/parse-resume", {
    method: "POST",
    body: formData,
  });

  const responseData: unknown = await res.json().catch(() => null);
  const data =
    responseData !== null &&
    typeof responseData === "object" &&
    !Array.isArray(responseData)
      ? (responseData as Record<string, unknown>)
      : null;

  if (!res.ok) {
    const message =
      typeof data?.message === "string" && data.message.trim()
        ? data.message.trim()
        : typeof data?.error === "string" && data.error.trim()
          ? data.error.trim()
          : "Could not parse resume PDF.";
    throw new Error(message);
  }

  if (typeof data?.text !== "string" || !data.text.trim()) {
    throw new Error(
      "No readable text could be extracted from this PDF. Try another file or paste your resume instead.",
    );
  }

  return data.text;
}
