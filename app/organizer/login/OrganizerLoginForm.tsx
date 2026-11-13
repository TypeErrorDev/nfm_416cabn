"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OrganizerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("We could not verify this account.");

      const { data: profile, error: profileError } = await supabase
        .from("organizer_profiles")
        .select("is_active")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile?.is_active) {
        await supabase.auth.signOut();
        throw new Error("This account is not authorized as an active event organizer.");
      }

      router.replace("/organizer");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="organizer-login-form" onSubmit={handleSubmit}>
      <div className="registration-field">
        <label htmlFor="organizer-email">Email address</label>
        <input id="organizer-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <div className="registration-field">
        <label htmlFor="organizer-password">Password</label>
        <input id="organizer-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </div>
      {message && <p className="registration-feedback registration-feedback-error" role="alert">{message}</p>}
      <button className="btn btn-primary registration-submit" type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </button>
      <Link className="organizer-back-link" href="/">Return to event website</Link>
    </form>
  );
}
