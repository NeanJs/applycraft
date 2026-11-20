import { parsePdf } from "@/app/lib/pdfParse";
import { MAX_RESUME_CHARS } from "@/app/lib/ai/quality";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 413 },
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "Invalid file type. Only PDF files are accepted." },
        { status: 415 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parsePdf(buffer);
    const cleaned = text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (cleaned.length > MAX_RESUME_CHARS) {
      return Response.json(
        {
          error: "resume_too_long",
          message: `Extracted resume text exceeds the ${MAX_RESUME_CHARS.toLocaleString()} character limit.`,
        },
        { status: 413 },
      );
    }

    return Response.json({ text: cleaned });
  } catch (err) {
    console.error("PDF parse error:", err);
    return Response.json(
      { error: "Failed to parse PDF. Please try again." },
      { status: 500 },
    );
  }
}
