"use client";

import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";

export interface ToolEngineOptions<TResult> {
  /** API route to POST to, e.g. "/api/tailor" or "/api/ats-score" */
  apiRoute: string;
  /** Build the request body from the current field values */
  buildBody: () => Record<string, unknown>;
  /** Validate inputs before submitting — return error string or null */
  validate?: () => string | null;
  /** Number of loading steps to cycle through while waiting */
  stepCount?: number;
  /** Milliseconds between auto-advancing loading steps (default: 7000) */
  stepInterval?: number;
  /** Called when the API returns a non-ok response with a known error code */
  onKnownError?: (code: string, message: string) => void;
  /** Success toast message (default: "Done!") */
  successMessage?: string;
}

export interface ToolEngineState<TResult> {
  result: TResult | undefined;
  loading: boolean;
  loadingStep: number;
  generate: () => Promise<void>;
  reset: () => void;
}

/**
 * Generic hook that drives the fetch → loading-steps → result cycle
 * shared by all tool pages.
 */
export function useToolEngine<TResult = unknown>({
  apiRoute,
  buildBody,
  validate,
  stepCount = 4,
  stepInterval = 7000,
  onKnownError,
  successMessage = "Done!",
}: ToolEngineOptions<TResult>): ToolEngineState<TResult> {
  const [result, setResult] = useState<TResult | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearStepInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const generate = useCallback(async () => {
    // Client-side validation
    if (validate) {
      const err = validate();
      if (err) {
        toast.error(err);
        return;
      }
    }

    setLoading(true);
    setLoadingStep(0);
    setResult(undefined);

    // Auto-advance loading steps
    intervalRef.current = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, stepCount - 1));
    }, stepInterval);

    try {
      const res = await fetch(apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildBody()),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && onKnownError) {
          onKnownError(data.error, data.message ?? "Something went wrong.");
          return;
        }
        toast.error(data.message ?? "Something went wrong.");
        return;
      }

      toast.success(successMessage);
      setResult(data as TResult);
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      clearStepInterval();
      setLoading(false);
      setLoadingStep(0);
    }
  }, [
    apiRoute,
    buildBody,
    validate,
    stepCount,
    stepInterval,
    onKnownError,
    successMessage,
  ]);

  const reset = useCallback(() => {
    clearStepInterval();
    setResult(undefined);
    setLoading(false);
    setLoadingStep(0);
  }, []);

  return { result, loading, loadingStep, generate, reset };
}
