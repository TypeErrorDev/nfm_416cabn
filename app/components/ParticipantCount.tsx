"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type CountState = "loading" | "ready" | "error";

export default function ParticipantCount() {
  const [count, setCount] = useState<number | null>(null);
  const [state, setState] = useState<CountState>("loading");

  useEffect(() => {
    let active = true;

    async function loadCount() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.rpc("get_public_participant_count");

        if (error) throw error;

        const nextCount = Number(data);
        if (!Number.isSafeInteger(nextCount) || nextCount < 0) {
          throw new Error("The participant count response was invalid.");
        }

        if (active) {
          setCount(nextCount);
          setState("ready");
        }
      } catch {
        if (active) setState("error");
      }
    }

    void loadCount();
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadCount();
    }, 30_000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="participant-count-section" aria-label="Event registration count">
      <div className="participant-count-inner">
        <div>
          <p className="eyebrow">The march is taking shape</p>
          <p className="participant-count-value" aria-live="polite" aria-atomic="true">
            {state === "loading" && count === null
              ? "—"
              : state === "error" && count === null
                ? "—"
                : (count ?? 0).toLocaleString("en-US")}
          </p>
          <h2>Participants Registered</h2>
          <p className="participant-count-caption">
            {state === "error" && count === null
              ? "Registration totals are temporarily unavailable. Please check back shortly."
              : "Every registration counts, whether marching for time or taking part in the experience."}
          </p>
        </div>
        <div className="participant-count-status">
          <span className={state === "ready" ? "participant-count-dot is-live" : "participant-count-dot"} aria-hidden="true" />
          <span>{state === "ready" ? "LIVE COUNT" : state === "loading" ? "LOADING" : "UPDATING"}</span>
          <span className="participant-count-refresh">Refreshes every 30 seconds</span>
        </div>
      </div>
    </section>
  );
}
