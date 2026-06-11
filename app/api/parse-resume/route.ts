import { parsePdf } from "@/app/lib/pdfParse";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return Response.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const text = await parsePdf(buffer);
    const cleaned = text.replace(/\s+/g, " ").trim();
    const limit = 6000;

    const sliced =
      cleaned.length > limit
        ? cleaned.slice(0, limit).replace(/\s+\S*$/, "") + "…"
        : cleaned;
    return Response.json({ text: sliced });
  } catch (err) {
    console.error("PDF parse error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
