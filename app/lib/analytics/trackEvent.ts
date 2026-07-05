"use client";

type EventProperties = Record<string, unknown>;

function getSessionKey(): string {
  const existing = window.sessionStorage.getItem("applycraft_session");
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.sessionStorage.setItem("applycraft_session", next);
  return next;
}

export function trackEvent(name: string, properties: EventProperties = {}) {
  if (typeof window === "undefined") return;

  const sessionKey = getSessionKey();
  const payload = JSON.stringify({
    name,
    properties,
    sessionKey,
  });

  fetch("/api/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
