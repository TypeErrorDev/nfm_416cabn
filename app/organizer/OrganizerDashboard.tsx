"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Participant = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  age: number;
  gender: "women" | "men";
  participating_for_time: boolean;
  branch: string;
  unit: string | null;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
};

type ViewState = "loading" | "ready" | "unauthorized" | "error";

function csvCell(value: string | number | boolean | null) {
  const text = value === null ? "" : String(value);
  return '"' + text.replace(/"/g, '""') + '"';
}

export default function OrganizerDashboard() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showContacts, setShowContacts] = useState(false);

  const loadParticipants = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      router.replace("/organizer/login");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("organizer_profiles")
      .select("is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      setViewState("error");
      setMessage("We could not verify organizer access. Please try again.");
      return;
    }
    if (!profile?.is_active) {
      await supabase.auth.signOut();
      setViewState("unauthorized");
      return;
    }

    const { data, error } = await supabase
      .from("participants")
      .select("id,created_at,full_name,email,age,gender,participating_for_time,branch,unit,emergency_contact_name,emergency_contact_relationship,emergency_contact_phone")
      .order("created_at", { ascending: false });

    if (error) {
      setViewState("error");
      setMessage("We could not load registrations. Check the organizer database permissions and try again.");
      return;
    }

    setParticipants((data ?? []) as Participant[]);
    setViewState("ready");
    setMessage("");
  }, [router]);

  useEffect(() => {
    void loadParticipants();
  }, [loadParticipants]);

  const filteredParticipants = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return participants;
    return participants.filter((participant) =>
      [participant.full_name, participant.email, participant.branch, participant.unit ?? ""]
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [participants, query]);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/organizer/login");
    router.refresh();
  }

  async function handleDelete(participant: Participant) {
    const confirmed = window.confirm(`Remove the registration for ${participant.full_name}? This cannot be undone.`);
    if (!confirmed) return;

    setBusyId(participant.id);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("participants").delete().eq("id", participant.id);

    if (error) {
      setMessage("The registration could not be removed. Verify the organizer DELETE policy in Supabase.");
    } else {
      setParticipants((current) => current.filter((item) => item.id !== participant.id));
      setMessage("Registration removed.");
    }
    setBusyId(null);
  }

  function exportCsv() {
    const headers = ["Registered at", "Full name", "Email", "Age", "Standard category", "Participating for time", "Branch", "Unit", "Emergency contact", "Relationship", "Emergency contact phone"];
    const rows = filteredParticipants.map((item) => [
      item.created_at, item.full_name, item.email, item.age, item.gender,
      item.participating_for_time ? "Yes" : "No", item.branch, item.unit,
      item.emergency_contact_name, item.emergency_contact_relationship, item.emergency_contact_phone,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "norwegian-foot-march-participants.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (viewState === "loading") {
    return <main className="organizer-page"><div className="organizer-panel"><p className="eyebrow">416th Civil Affairs Battalion</p><h1>Organizer dashboard</h1><p>Verifying access and loading registrations...</p></div></main>;
  }

  if (viewState === "unauthorized") {
    return <main className="organizer-page"><div className="organizer-panel"><p className="eyebrow">Access restricted</p><h1>Organizer access required</h1><p>This account is not authorized to manage event registrations.</p><Link className="btn btn-primary" href="/organizer/login">Return to sign in</Link></div></main>;
  }

  if (viewState === "error") {
    return <main className="organizer-page"><div className="organizer-panel"><p className="eyebrow">Organizer access</p><h1>Dashboard unavailable</h1><p role="alert">{message}</p><button className="btn btn-primary" onClick={() => { setViewState("loading"); void loadParticipants(); }}>Try again</button><button className="btn btn-ghost" onClick={handleSignOut}>Sign out</button></div></main>;
  }

  return (
    <main className="organizer-page">
      <div className="organizer-dashboard">
        <header className="organizer-header">
          <div><p className="eyebrow">416th Civil Affairs Battalion · Event administration</p><h1>Organizer dashboard</h1><p>Norwegian Foot March · January 23, 2027 · Oceanside, California</p></div>
          <div className="organizer-header-actions"><Link className="btn btn-ghost" href="/">View public site</Link><button className="btn btn-ghost" onClick={handleSignOut}>Sign out</button></div>
        </header>

        <section className="organizer-summary" aria-label="Registration summary">
          <div><span>Total registrations</span><strong>{participants.length.toLocaleString("en-US")}</strong></div>
          <div><span>Participating for time</span><strong>{participants.filter((item) => item.participating_for_time).length.toLocaleString("en-US")}</strong></div>
          <div><span>Not participating for time</span><strong>{participants.filter((item) => !item.participating_for_time).length.toLocaleString("en-US")}</strong></div>
        </section>

        <section className="organizer-table-panel">
          <div className="organizer-table-heading"><div><p className="eyebrow">Participant records</p><h2>Registrations</h2><p>{filteredParticipants.length} of {participants.length} registrations shown</p></div><button className="btn btn-primary" onClick={exportCsv} disabled={filteredParticipants.length === 0}>Export CSV</button></div>
          <div className="organizer-toolbar">
            <label htmlFor="participant-search">Search name, email, branch, or unit</label>
            <input id="participant-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search registrations..." />
            <label className="organizer-toggle"><input type="checkbox" checked={showContacts} onChange={(event) => setShowContacts(event.target.checked)} /> Show emergency contact details</label>
          </div>
          {message && <p className="registration-feedback" role="status">{message}</p>}
          <div className="organizer-table-scroll">
            <table className="organizer-table">
              <thead><tr><th>Participant</th><th>Age</th><th>Category</th><th>Branch / unit</th><th>For time?</th><th>Registered</th>{showContacts && <th>Emergency contact</th>}<th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {filteredParticipants.map((item) => <tr key={item.id}>
                  <td><strong>{item.full_name}</strong><span>{item.email}</span></td>
                  <td>{item.age}</td>
                  <td>{item.gender === "women" ? "Women's" : "Men's"}</td>
                  <td>{item.branch}<span>{item.unit || "—"}</span></td>
                  <td>{item.participating_for_time ? "Yes" : "No"}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  {showContacts && <td>{item.emergency_contact_name}<span>{item.emergency_contact_relationship} · {item.emergency_contact_phone}</span></td>}
                  <td><button className="organizer-delete-button" onClick={() => void handleDelete(item)} disabled={busyId === item.id}>{busyId === item.id ? "Removing..." : "Remove"}</button></td>
                </tr>)}
                {filteredParticipants.length === 0 && <tr><td colSpan={showContacts ? 8 : 7} className="organizer-empty">No registrations match this search.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="organizer-sensitive-note">Participant and emergency contact information is sensitive. Download and share CSV exports only with authorized event personnel.</p>
        </section>
      </div>
    </main>
  );
}
