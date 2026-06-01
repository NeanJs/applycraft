import ResumeTemplate from "@/app/template/resume-template";
import { ResumeData } from "@/app/types/types";

import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    const resumeData = normalizeResume(rawData);

    const html = renderResume(resumeData);
    // 1. Render React component to HTML

    // 2. Wrap it in a full HTML document

    const fullHtml = `
      <html>
        <head>
          <style>
            /* optional: inject your global CSS or Tailwind build */
            body { margin: 0; font-family: sans-serif; }
          </style>
        </head>
        <body>
          <div id="resume-template">
            ${html}
          </div>
        </body>
      </html>
    `;

    // 3. Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // 4. Directly set content (NO routing, NO URL)
    await page.setContent(fullHtml, {
      waitUntil: "networkidle0",
    });

    await page.emulateMediaType("screen");

    await page.waitForSelector("#resume-template");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
