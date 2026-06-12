import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { syncUser } from "@/app/lib/sync-user";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId } = await req.json();
    if (!resumeId) {
      return Response.json({ error: "Missing resumeId" }, { status: 400 });
    }

    // Ownership check — ensure this resume belongs to the requesting user
    const user = await syncUser();
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.userId !== user.id) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Short-lived signed token for the print page
    const token = jwt.sign({ resumeId }, process.env.PRINT_TOKEN_SECRET!, {
      expiresIn: "2m",
    });

    const url = `${process.env.BASE_URL}/resume/${resumeId}/print?token=${token}`;
    const browserlessToken = process.env.BROWSERLESS_TOKEN;

    const pdfRes = await fetch(
      `https://chrome.browserless.io/pdf?token=${browserlessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          options: {
            printBackground: true,
            format: "A4",
            margin: {
              top: "0.5in",
              bottom: "0.5in",
              left: "0.5in",
              right: "0.5in",
            },
          },
        }),
      },
    );

    if (!pdfRes.ok) {
      const text = await pdfRes.text();
      console.error("Browserless error:", text);
      throw new Error("PDF generation failed");
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 },
    );
  }
}
