import ResumeTemplate from "@/app/template/resume-template";
import { ResumeData } from "@/app/types/types";

import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const resumeData = await req.json();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = `http://localhost:3000/resume/print?data=${encodeURIComponent(
      JSON.stringify(resumeData),
    )}`;

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

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
