export type ParsedValue<T> =
  | { valid: true; value: T }
  | { valid: false };

export function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function readJsonRecord(
  request: Request,
): Promise<Record<string, unknown> | null> {
  let value: unknown;

  try {
    value = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }

  return isJsonRecord(value) ? value : null;
}

export function parseOptionalString(value: unknown): ParsedValue<string | null> {
  if (value === undefined || value === null) {
    return { valid: true, value: null };
  }
  if (typeof value !== "string") return { valid: false };

  const normalized = value.trim();
  return { valid: true, value: normalized.length > 0 ? normalized : null };
}

export function parseOptionalDate(value: unknown): ParsedValue<Date | null> {
  const parsedString = parseOptionalString(value);
  if (!parsedString.valid) return { valid: false };
  if (parsedString.value === null) return { valid: true, value: null };

  const date = new Date(parsedString.value);
  return Number.isNaN(date.getTime())
    ? { valid: false }
    : { valid: true, value: date };
}
