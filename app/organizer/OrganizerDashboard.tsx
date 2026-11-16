"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Participant = {
  id: string;
  created_at: string;
  registration_status: "Active" | "Withdrawn";
  full_name: string;
  email: string;
  age: number;
  gender: "women" | "men";
  participating_for_time: boolean;
  ruck_time: string | null;
  completion_status: "Registered" | "Checked In" | "Completed" | "Did Not Complete";
  branch: string;
  unit: string | null;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
};

type Volunteer = { id: string; created_at: string; full_name: string; email: string; assignment: string; emergency_contact_name: string; emergency_contact_relationship: string; emergency_contact_phone: string; };

type ViewState = "loading" | "ready" | "unauthorized" | "error";

function csvCell(value: string | number | boolean | null) {
  let text = value === null ? "" : String(value);
  if (/^[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}

export default function OrganizerDashboard() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [savingTimeId, setSavingTimeId] = useState<string | null>(null);
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

    const pageSize = 500;
    const allParticipants: Participant[] = [];
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from("participants")
        .select("id,created_at,registration_status,full_name,email,age,gender,participating_for_time,ruck_time,completion_status,branch,unit,emergency_contact_name,emergency_contact_relationship,emergency_contact_phone")
        .order("created_at", { ascending: false })
        .range(from, from + pageSize - 1);

      if (error) {
        setViewState("error");
        setMessage("We could not load registrations. Check the organizer database permissions and try again.");
        return;
      }

      allParticipants.push(...((data ?? []) as Participant[]));
      if (!data || data.length < pageSize) break;
    }

    const { data: volunteerRows, error: volunteerError } = await supabase
      .from("volunteers")
      .select("id,created_at,full_name,email,assignment,emergency_contact_name,emergency_contact_relationship,emergency_contact_phone")
      .order("created_at", { ascending: false });
    if (volunteerError) {
      setViewState("error");
      setMessage("We could not load volunteer registrations. Apply the volunteer database migration and check organizer permissions.");
      return;
    }
    setParticipants(allParticipants);
    setVolunteers((volunteerRows ?? []) as Volunteer[]);
    setViewState("ready");
    setMessage("");
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    // Defer the async load until after the effect has completed.
    void Promise.resolve().then(() => {
      if (!cancelled) return loadParticipants();
    });

    return () => {
      cancelled = true;
    };
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

  function updateRuckTime(participantId: string, value: string) {
    setParticipants((current) =>
      current.map((item) => item.id === participantId ? { ...item, ruck_time: value } : item)
    );
  }

  async function saveRuckTime(participant: Participant) {
    const value = (participant.ruck_time ?? "").trim();
    if (value && !/^\d+:[0-5]\d:[0-5]\d$/.test(value)) {
      setMessage("Enter the ruck time as H:MM:SS, for example 4:32:18.");
      return;
    }

    setSavingTimeId(participant.id);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("participants")
      .update({ ruck_time: value || null })
      .eq("id", participant.id);

    if (error) {
      setMessage("The ruck time could not be saved. Verify the Supabase ruck_time column and organizer UPDATE policy.");
    } else {
      setParticipants((current) =>
        current.map((item) => item.id === participant.id ? { ...item, ruck_time: value || null } : item)
      );
      setMessage(`Ruck time saved for ${participant.full_name}.`);
    }
    setSavingTimeId(null);
  }

  function updateCompletionStatus(participantId: string, value: Participant["completion_status"]) {
    setParticipants((current) =>
      current.map((item) => item.id === participantId ? { ...item, completion_status: value } : item)
    );
  }

  async function saveCompletionStatus(participant: Participant) {
    setSavingTimeId(participant.id);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("participants")
      .update({ completion_status: participant.completion_status })
      .eq("id", participant.id);

    if (error) {
      setMessage("The participant status could not be saved. Verify the Supabase completion_status column and organizer UPDATE policy.");
    } else {
      setMessage(`Status saved for ${participant.full_name}.`);
    }
    setSavingTimeId(null);
  }

  async function withdrawParticipant(participant: Participant) {
    if (participant.registration_status === "Withdrawn") return;
    if (!window.confirm(`Mark ${participant.full_name} as withdrawn? Their record will be retained.`)) return;
    setBusyId(participant.id);
    const { error } = await getSupabaseBrowserClient().from("participants").update({ registration_status: "Withdrawn" }).eq("id", participant.id);
    if (error) setMessage("Could not update registration status. Apply the database migration and verify organizer update permissions.");
    else {
      setParticipants((current) => current.map((item) => item.id === participant.id ? { ...item, registration_status: "Withdrawn" } : item));
      setMessage(`${participant.full_name} marked as withdrawn. Record retained.`);
    }
    setBusyId(null);
  }

  function exportVolunteers() {
    const headers = ["Registered at", "Full name", "Email", "Assignment", "Emergency contact", "Relationship", "Emergency contact phone"];
    const rows = volunteers.map((item) => [item.created_at, item.full_name, item.email, item.assignment, item.emergency_contact_name, item.emergency_contact_relationship, item.emergency_contact_phone]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\\r\\n");
    const blob = new Blob(["\\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "norwegian-foot-march-volunteers.csv"; anchor.click(); URL.revokeObjectURL(url);
  }

  function exportCsv() {
    const headers = ["Registered at", "Full name", "Email", "Age", "Standard category", "Participating for time", "Ruck time (H:MM:SS)", "Completion status", "Branch", "Unit", "Emergency contact", "Relationship", "Emergency contact phone"];
    const rows = filteredParticipants.map((item) => [
      item.created_at, item.registration_status, item.full_name, item.email, item.age, item.gender,
      item.participating_for_time ? "Yes" : "No", item.ruck_time ?? "", item.completion_status, item.branch, item.unit,
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
    return <main className="organizer-page"><div className="organizer-panel"><p className="eyebrow">Ares Company</p><h1>Organizer dashboard</h1><p>Verifying access and loading registrations...</p></div></main>;
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
          <div><p className="eyebrow">Ares Company · Event administration</p><h1>Organizer dashboard</h1><p>Norwegian Foot March · January 23, 2027 · Oceanside, California</p></div>
          <div className="organizer-header-actions"><Link className="btn btn-ghost" href="/">View public site</Link><button className="btn btn-ghost" onClick={handleSignOut}>Sign out</button></div>
        </header>

        <section className="organizer-summary" aria-label="Registration summary">
          <div><span>Active participants</span><strong>{participants.filter((item) => item.registration_status === "Active").length.toLocaleString("en-US")}</strong></div>
          <div><span>Withdrawn participants</span><strong>{participants.filter((item) => item.registration_status === "Withdrawn").length.toLocaleString("en-US")}</strong></div>
          <div><span>Volunteers</span><strong>{volunteers.length.toLocaleString("en-US")}</strong></div>
        </section>

        <section className="organizer-table-panel">
          <div className="organizer-table-heading"><div><p className="eyebrow">Participant records</p><h2>Registrations</h2><p>{filteredParticipants.length} of {participants.length} participant records shown</p></div><button className="btn btn-primary" onClick={exportCsv} disabled={filteredParticipants.length === 0}>Export CSV</button></div>
          <div className="organizer-toolbar">
            <label htmlFor="participant-search">Search name, email, branch, or unit</label>
            <input id="participant-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search registrations..." />
            <label className="organizer-toggle"><input type="checkbox" checked={showContacts} onChange={(event) => setShowContacts(event.target.checked)} /> Show emergency contact details</label>
          </div>
          {message && <p className="registration-feedback" role="status">{message}</p>}
          <div className="organizer-table-scroll">
            <table className="organizer-table">
              <thead><tr><th>Participant</th><th>Age</th><th>Category</th><th>Branch / unit</th><th>For time?</th><th>Ruck time</th><th>Completion status</th><th>Registration</th><th>Registered</th>{showContacts && <th>Emergency contact</th>}<th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {filteredParticipants.map((item) => <tr key={item.id}>
                  <td><strong>{item.full_name}</strong><span>{item.email}</span></td>
                  <td>{item.age}</td>
                  <td>{item.gender === "women" ? "Women's" : "Men's"}</td>
                  <td>{item.branch}<span>{item.unit || "—"}</span></td>
                  <td>{item.participating_for_time ? "Yes" : "No"}</td>
                  <td className="organizer-ruck-time-cell">
                    <label className="sr-only" htmlFor={`ruck-time-${item.id}`}>Ruck time for {item.full_name} (hours:minutes:seconds)</label>
                    <input
                      id={`ruck-time-${item.id}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="H:MM:SS"
                      value={item.ruck_time ?? ""}
                      onChange={(event) => updateRuckTime(item.id, event.target.value)}
                      aria-describedby={`ruck-time-help-${item.id}`}
                    />
                    <span id={`ruck-time-help-${item.id}`}>Example: 4:32:18</span>
                    <button
                      className="organizer-save-button"
                      type="button"
                      onClick={() => void saveRuckTime(item)}
                      disabled={savingTimeId === item.id || (!!item.ruck_time?.trim() && !/^\d+:[0-5]\d:[0-5]\d$/.test(item.ruck_time.trim()))}
                    >{savingTimeId === item.id ? "Saving..." : "Save time"}</button>
                  </td>
                  <td className="organizer-status-cell">
                    <label className="sr-only" htmlFor={`status-${item.id}`}>Completion status for {item.full_name}</label>
                    <select
                      id={`status-${item.id}`}
                      value={item.completion_status}
                      onChange={(event) => updateCompletionStatus(item.id, event.target.value as Participant["completion_status"])}
                    >
                      <option value="Registered">Registered</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Completed">Completed</option>
                      <option value="Did Not Complete">Did Not Complete</option>
                    </select>
                    <button className="organizer-save-button" type="button" onClick={() => void saveCompletionStatus(item)} disabled={savingTimeId === item.id}>
                      {savingTimeId === item.id ? "Saving..." : "Save status"}
                    </button>
                  </td>
                  <td>{item.registration_status}</td><td>{new Date(item.created_at).toLocaleDateString()}</td>
                  {showContacts && <td>{item.emergency_contact_name}<span>{item.emergency_contact_relationship} · {item.emergency_contact_phone}</span></td>}
                  <td><button className="organizer-delete-button" onClick={() => void toggleWithdrawal(item)} disabled={busyId === item.id}>{busyId === item.id ? "Saving..." : item.registration_status === "Active" ? "Withdraw" : "Restore"}</button></td>
                </tr>)}
                {filteredParticipants.length === 0 && <tr><td colSpan={showContacts ? 10 : 9} className="organizer-empty">No registrations match this search.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="organizer-sensitive-note">Participant and emergency contact information is sensitive. Download and share CSV exports only with authorized event personnel. Withdrawn records are retained for event administration.</p>
        </section>
        <section className="organizer-table-panel" style={{ marginTop: 24 }}>
          <div className="organizer-table-heading"><div><p className="eyebrow">Volunteer records</p><h2>Volunteer assignments</h2><p>{volunteers.length} volunteers registered</p></div>
            <button className="btn btn-primary" onClick={() => {
              const headers = ["Registered at", "Full name", "Email", "Assignment", "Emergency contact", "Relationship", "Emergency contact phone"];
              const rows = volunteers.map((v) => [v.created_at, v.full_name, v.email, v.assignment, v.emergency_contact_name, v.emergency_contact_relationship, v.emergency_contact_phone]);
              const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
              const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "norwegian-foot-march-volunteers.csv"; anchor.click(); URL.revokeObjectURL(url);
            }} disabled={volunteers.length === 0}>Export volunteer CSV</button>
          </div>
          <div className="organizer-summary">{["Water / First Aid Station 1", "Water / First Aid Station 2", "Water / First Aid Station 3", "Start / Registration", "Turnaround", "Finish Line"].map((assignment) => <div key={assignment}><span>{assignment}</span><strong>{volunteers.filter((v) => v.assignment === assignment).length}</strong></div>)}</div>
          <div className="organizer-table-scroll"><table className="organizer-table"><thead><tr><th>Volunteer</th><th>Assignment</th><th>Registered</th>{showContacts && <th>Emergency contact</th>}</tr></thead><tbody>
            {volunteers.map((v) => <tr key={v.id}><td><strong>{v.full_name}</strong><span>{v.email}</span></td><td>{v.assignment}</td><td>{new Date(v.created_at).toLocaleDateString()}</td>{showContacts && <td>{v.emergency_contact_name}<span>{v.emergency_contact_relationship} · {v.emergency_contact_phone}</span></td>}</tr>)}
            {volunteers.length === 0 && <tr><td colSpan={showContacts ? 4 : 3} className="organizer-empty">No volunteers have registered yet.</td></tr>}
          </tbody></table></div>
          <p className="organizer-sensitive-note">Volunteer and emergency contact information is sensitive. Share only with authorized event personnel.</p>
        </section>
      </div>
    </main>
  );
}
