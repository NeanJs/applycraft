type InternalAccessInput = {
  userId?: string | null;
  emails?: string[];
};

function parseListEnv(value?: string): Set<string> {
  if (!value) return new Set();

  const trimmed = value.trim();
  if (!trimmed) return new Set();

  // Accept JSON array style values, e.g. ["a@x.com", "b@x.com"]
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return new Set(
          parsed
            .map((item) => String(item).trim().toLowerCase())
            .filter(Boolean),
        );
      }
    } catch {
      // Fall back to CSV parsing below.
    }
  }

  return new Set(
    trimmed
      .split(",")
      .map((item) => item.replace(/^['"\[]+|['"\]]+$/g, "").trim().toLowerCase())
      .filter(Boolean),
  );
}

function isTruthy(value?: string) {
  return ["1", "true", "yes", "on"].includes((value ?? "").trim().toLowerCase());
}

export function canAccessAnalytics({ userId, emails = [] }: InternalAccessInput) {
  const allowedIds = parseListEnv(
    process.env.ANALYTICS_ALLOWED_USER_IDS ?? process.env.ANALYTICS_ALLOW_USER_IDS,
  );
  const allowedEmails = parseListEnv(
    process.env.ANALYTICS_ALLOWED_EMAILS ??
      process.env.ANALYTICS_ALLOW_EMAILS ??
      process.env.ALLOWEMAILS ??
      process.env.allowemails,
  );

  const normalizedUserId = (userId ?? "").trim().toLowerCase();
  const normalizedEmails = emails.map((email) => email.trim().toLowerCase());

  if (!normalizedUserId && normalizedEmails.length === 0) return false;

  const enforceAllowlistEverywhere = isTruthy(
    process.env.ANALYTICS_ENFORCE_ALLOWLIST,
  );

  if (process.env.NODE_ENV !== "production" && !enforceAllowlistEverywhere) {
    // Development/staging convenience: any authenticated user can inspect analytics.
    return true;
  }

  if (allowedIds.size === 0 && allowedEmails.size === 0) {
    // Production must be explicitly allowlisted.
    return false;
  }

  if (normalizedUserId && allowedIds.has(normalizedUserId)) return true;

  return normalizedEmails.some((email) => allowedEmails.has(email));
}
