"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type CountState = "loading" | "ready" | "error";

export default function ParticipantCount() {
  const [count, setCount] = useState<number | null>(null);
  const [state, setState] = useState<CountState>("loading");

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    async function loadCount() {
      try {
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
        if (active && count === null) setState("error");
      }
    }

    void loadCount();

    const channel = supabase
      .channel("public:participant-count")
      .on("broadcast", { event: "participant_count_updated" }, () => {
        void loadCount();
      })
      .subscribe((status) => {
        if (!active) return;
        if (status === "SUBSCRIBED") {
          setState((current) => (current === "error" ? "loading" : current));
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          setState((current) => (current === "ready" ? current : "error"));
        }
      });

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="participant-count-section" aria-label="Event registration count">
      <div className="participant-count-inner">
        <div>
          <p className="eyebrow">The march is taking shape</p>
          <p className="participant-count-value" aria-live="polite" aria-atomic="true">
            {count === null ? "—" : count.toLocaleString("en-US")}
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
          <span>{state === "ready" ? "LIVE COUNT" : state === "loading" ? "CONNECTING" : "RECONNECTING"}</span>
          <span className="participant-count-refresh">Updates when a registration is added or removed</span>
        </div>
      </div>
    </section>
  );
}
