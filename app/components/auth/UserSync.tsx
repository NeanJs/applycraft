"use client";

import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

export default function UserSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      if (!isSignedIn) {
        syncedUserIdRef.current = null;
      }
      return;
    }

    if (syncedUserIdRef.current === user.id) return;

    syncedUserIdRef.current = user.id;
    void fetch("/api/auth/sync-user", { method: "POST" }).catch(() => undefined);
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}
