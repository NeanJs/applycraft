const CONTROL_CHAR_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

export function removeNullChars(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(CONTROL_CHAR_REGEX, "").replace(/\u0000/g, "");
  }

  if (Array.isArray(value)) {
    return value.map(removeNullChars);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, removeNullChars(v)]),
    );
  }

  return value;
}
