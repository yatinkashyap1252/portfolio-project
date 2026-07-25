"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    // Only track in browser environment and once per session
    if (typeof window === "undefined") return;

    const sessionKey = "portfolio_visited";
    if (sessionStorage.getItem(sessionKey)) {
      // Already tracked this session
      return;
    }

    const trackVisit = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        
        const payload = {
          referrer: document.referrer || "Direct",
          language: navigator.language || "unknown",
          screenResolution: `${window.screen.width}x${window.screen.height}`,
        };

        const response = await fetch(`${API_BASE_URL}/cms/visit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          sessionStorage.setItem(sessionKey, "true");
        }
      } catch (error) {
        // Silent error so page load is not disrupted
        console.warn("Failed to log visit to backend:", error);
      }
    };

    // Trigger after a tiny delay so it doesn't block critical page load operations
    const timer = setTimeout(trackVisit, 800);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
