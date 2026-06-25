import { handleError } from "../errorHandler";

export function parseClaudeResponse(message: any) {
  const text = message.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("")
    .trim();

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    handleError(error, "Failed JSON:");

    throw error;
  }
}
