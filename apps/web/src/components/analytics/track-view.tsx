"use client";

import { useEffect, useRef } from "react";

export function TrackPropertyView({ propertyId }: { propertyId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    let sessionId = sessionStorage.getItem("_sid");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("_sid", sessionId);
    }

    fetch("/api/analytics/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, sessionId }),
    }).catch(() => {});
  }, [propertyId]);

  return null;
}
