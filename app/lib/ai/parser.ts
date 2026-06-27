import { handleError } from "../errorHandler";

export function parseClaudeResponse(message: { content: Array<{ type: string; text?: string }> }) {
  const content = Array.isArray(message.content) ? message.content : [];

  const text = content
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
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
