export function handleError(error: unknown, message: string) {
  console.error(message, error);

  // API/server paths must never call browser-only toast APIs.
  if (typeof window === "undefined") return;

  const safeMessage = message || "Something went wrong. Please try again.";
  void import("react-hot-toast")
    .then(({ toast }) => {
      toast.error(safeMessage);
    })
    .catch(() => {
      // Ignore toast loading failures and keep console error as fallback.
    });
}
