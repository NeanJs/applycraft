import { handleError } from "../errorHandler";

type ClaudeTextBlock = { type: "text"; text: string };
type ClaudeContentBlock = ClaudeTextBlock | { type: string };

export class ParseClaudeResponseError extends Error {
  rawText: string;
  cleanedText: string;

  constructor(message: string, rawText: string, cleanedText: string) {
    super(message);
    this.name = "ParseClaudeResponseError";
    this.rawText = rawText;
    this.cleanedText = cleanedText;
  }
}

function extractJsonCandidate(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const firstObjectStart = trimmed.indexOf("{");
  const lastObjectEnd = trimmed.lastIndexOf("}");
  if (firstObjectStart !== -1 && lastObjectEnd > firstObjectStart) {
    return trimmed.slice(firstObjectStart, lastObjectEnd + 1);
  }

  const firstArrayStart = trimmed.indexOf("[");
  const lastArrayEnd = trimmed.lastIndexOf("]");
  if (firstArrayStart !== -1 && lastArrayEnd > firstArrayStart) {
    return trimmed.slice(firstArrayStart, lastArrayEnd + 1);
  }

  return trimmed;
}

function parseJsonValue(value: string) {
  const parsed = JSON.parse(value) as unknown;
  if (parsed === null || typeof parsed !== "object") {
    throw new Error("Claude response JSON must be an object or array.");
  }
  return parsed;
}

export function parseClaudeResponse(message: { content: ClaudeContentBlock[] }) {
  const text = message.content
    .filter((block): block is ClaudeTextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) {
    const error = new ParseClaudeResponseError(
      "Claude returned an empty text response.",
      text,
      "",
    );
    handleError(error, "Failed to parse Claude JSON response: empty text content.");
    throw error;
  }

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return parseJsonValue(cleaned);
  } catch (error) {
    const candidate = extractJsonCandidate(cleaned);
    try {
      return parseJsonValue(candidate);
    } catch {
      const parseError = new ParseClaudeResponseError(
        error instanceof Error ? error.message : "Failed to parse Claude JSON response.",
        text,
        candidate,
      );
      handleError(
        parseError,
        `Failed to parse Claude JSON response. Snippet: ${candidate.slice(0, 220)}`,
      );

      throw parseError;
    }
  }
}
