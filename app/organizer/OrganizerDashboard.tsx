"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type CompletionStatus = "Registered" | "Checked In" | "Completed" | "Did Not Complete";
type Participant = {
  id: string; created_at: string; registration_status: "Active" | "Withdrawn";
  full_name: string; email: string; age: number; gender: "women" | "men";
  participating_for_time: boolean; ruck_time: string | null; completion_status: CompletionStatus;
  branch: string; unit: string | null; emergency_contact_name: string;
  emergency_contact_relationship: string; emergency_contact_phone: string;
};
type Volunteer = {
  id: string; created_at: string; full_name: string; email: string; assignment: string;
  emergency_contact_name: string; emergency_contact_relationship: string; emergency_contact_phone: string;
};
type ViewState = "loading" | "ready" | "unauthorized" | "error";

function csvCell(value: string | number | boolean | null) {
  let text = value === null ? "" : String(value);
  if (/^[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
function downloadCsv(filename: string, headers: (string | number | boolean | null)[][]) {
  const csv = headers.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
}

export default function OrganizerDashboard() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [roster, setRoster] = useState<"participants" | "volunteers">("participants");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showContacts, setShowContacts] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) { router.replace("/organizer/login"); return; }
    const { data: profile, error: profileError } = await supabase.from("organizer_profiles").select("is_active").eq("user_id", user.id).maybeSingle();
    if (profileError) { setViewState("error"); setMessage("We could not verify organizer access."); return; }
    if (!profile?.is_active) { await supabase.auth.signOut(); setViewState("unauthorized"); return; }

    const [participantResult, volunteerResult] = await Promise.all([
      supabase.from("participants").select("id,created_at,registration_status,full_name,email,age,gender,participating_for_time,ruck_time,completion_status,branch,unit,emergency_contact_name,emergency_contact_relationship,emergency_contact_phone").order("created_at", { ascending: false }),
      supabase.from("volunteers").select("id,created_at,full_name,email,assignment,emergency_contact_name,emergency_contact_relationship,emergency_contact_phone").order("created_at", { ascending: false }),
    ]);
    if (participantResult.error || volunteerResult.error) {
      setViewState("error");
      setMessage("Could not load both rosters. Apply the Supabase migration and verify organizer permissions.");
      return;
    }
    setParticipants((participantResult.data ?? []) as Participant[]);
    setVolunteers((volunteerResult.data ?? []) as Volunteer[]);
    setViewState("ready"); setMessage("");
  }, [router]);

  useEffect(() => { let active = true; void Promise.resolve().then(() => { if (active) void loadData(); }); return () => { active = false; }; }, [loadData]);

  const filteredParticipants = useMemo(() => {
    const term = query.trim().toLowerCase();
    return participants.filter((p) => !term || [p.full_name, p.email, p.branch, p.unit ?? ""].some((v) => v.toLowerCase().includes(term)));
  }, [participants, query]);

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    router.replace("/organizer/login"); router.refresh();
  }
  async function updateParticipant(id: string, values: Partial<Pick<Participant, "ruck_time" | "completion_status" | "registration_status">>) {
    setSavingId(id); setMessage("");
    const { error } = await getSupabaseBrowserClient().from("participants").update(values).eq("id", id);
    if (error) setMessage("Could not save this participant update. Check the organizer database permissions.");
    else { setParticipants((current) => current.map((p) => p.id === id ? { ...p, ...values } : p)); setMessage("Participant record updated."); }
    setSavingId(null);
  }
  function exportParticipants() {
    const headers = ["Registered at","Registration status","Full name","Email","Age","Standard category","Participating for time","Ruck time","Completion status","Branch","Unit","Emergency contact","Relationship","Emergency contact phone"];
    const rows = filteredParticipants.map((p) => [p.created_at,p.registration_status,p.full_name,p.email,p.age,p.gender,p.participating_for_time ? "Yes" : "No",p.ruck_time ?? "",p.completion_status,p.branch,p.unit,p.emergency_contact_name,p.emergency_contact_relationship,p.emergency_contact_phone]);
    downloadCsv("norwegian-foot-march-participants.csv", [headers, ...rows]);
  }
  function exportVolunteers() {
    const headers = ["Registered at","Full name","Email","Assignment","Emergency contact","Relationship","Emergency contact phone"];
    const rows = volunteers.map((v) => [v.created_at,v.full_name,v.email,v.assignment,v.emergency_contact_name,v.emergency_contact_relationship,v.emergency_contact_phone]);
    downloadCsv("norwegian-foot-march-volunteers.csv", [headers, ...rows]);
  }

  if (viewState === "loading") return <main className="organizer-page"><div className="organizer-panel"><p className="eyebrow">Ares Company</p><h1>Organizer dashboard</h1><p>Verifying access and loading registrations...</p></div></main>;
  if (viewState === "unauthorized") return <main className="organizer-page"><div className="organizer-panel"><p className="eyebrow">Access restricted</p><h1>Organizer access required</h1><p>This account is not authorized to manage event registrations.</p><Link className="btn btn-primary" href="/organizer/login">Return to sign in</Link></div></main>;
  if (viewState === "error") return <main className="organizer-page"><div className="organizer-panel"><p className="eyebrow">Organizer access</p><h1>Dashboard unavailable</h1><p role="alert">{message}</p><button className="btn btn-primary" onClick={() => { setViewState("loading"); void loadData(); }}>Try again</button><button className="btn btn-ghost" onClick={signOut}>Sign out</button></div></main>;

  const activeCount = participants.filter((p) => p.registration_status === "Active").length;
  const withdrawnCount = participants.length - activeCount;
  const assignments = ["Water / First Aid Station 1","Water / First Aid Station 2","Water / First Aid Station 3","Start / Registration","Turnaround","Finish Line"];

  return (
    <main className="organizer-page"><div className="organizer-dashboard">
      <header className="organizer-header">
        <div><p className="eyebrow">Ares Company · Event administration</p><h1>Organizer dashboard</h1><p>Norwegian Foot March · January 23, 2027 · Oceanside, California</p></div>
        <div className="organizer-header-actions"><Link className="btn btn-ghost" href="/">View public site</Link><button className="btn btn-ghost" onClick={signOut}>Sign out</button></div>
      </header>
      <section className="organizer-summary" aria-label="Registration summary">
        <div><span>Active participants</span><strong>{activeCount.toLocaleString("en-US")}</strong></div>
        <div><span>Withdrawn participants</span><strong>{withdrawnCount.toLocaleString("en-US")}</strong></div>
        <div><span>Volunteers</span><strong>{volunteers.length.toLocaleString("en-US")}</strong></div>
      </section>
      <div className="organizer-roster-tabs" role="group" aria-label="Choose registration roster">
        <button type="button" className={roster === "participants" ? "is-active" : ""} aria-pressed={roster === "participants"} onClick={() => setRoster("participants")}>Participants ({participants.length})</button>
        <button type="button" className={roster === "volunteers" ? "is-active" : ""} aria-pressed={roster === "volunteers"} onClick={() => setRoster("volunteers")}>Volunteers ({volunteers.length})</button>
      </div>
      {message && <p className="registration-feedback" role="status">{message}</p>}
      <label className="organizer-toggle"><input type="checkbox" checked={showContacts} onChange={(e) => setShowContacts(e.target.checked)} /> Show emergency contact details</label>
      {roster === "participants" ? <section className="organizer-table-panel">
        <div className="organizer-table-heading"><div><p className="eyebrow">Participant records</p><h2>Participants</h2><p>{filteredParticipants.length} of {participants.length} registrations shown</p></div><button className="btn btn-primary" onClick={exportParticipants} disabled={!filteredParticipants.length}>Export participants CSV</button></div>
        <div className="organizer-toolbar"><label htmlFor="participant-search">Search name, email, branch, or unit</label><input id="participant-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search registrations..." /></div>
        <div className="organizer-table-scroll"><table className="organizer-table">
          <thead><tr><th>Participant</th><th>Age</th><th>Category</th><th>Branch / unit</th><th>For time?</th><th>Registration</th><th>Ruck time</th><th>Completion</th><th>Registered</th>{showContacts && <th>Emergency contact</th>}<th>Action</th></tr></thead>
          <tbody>{filteredParticipants.map((p) => <tr key={p.id}>
            <td><strong>{p.full_name}</strong><span>{p.email}</span></td><td>{p.age}</td><td>{p.gender === "women" ? "Women's" : "Men's"}</td><td>{p.branch}<span>{p.unit || "—"}</span></td><td>{p.participating_for_time ? "Yes" : "No"}</td><td>{p.registration_status}</td>
            <td className="organizer-ruck-time-cell"><label className="sr-only" htmlFor={"ruck-" + p.id}>Ruck time for {p.full_name}</label><input id={"ruck-" + p.id} type="text" inputMode="numeric" placeholder="H:MM:SS" value={p.ruck_time ?? ""} onChange={(e) => setParticipants((current) => current.map((item) => item.id === p.id ? { ...item, ruck_time: e.target.value } : item))} /><button className="organizer-save-button" type="button" disabled={savingId === p.id || (!!p.ruck_time?.trim() && !/^\d+:[0-5]\d:[0-5]\d$/.test(p.ruck_time.trim()))} onClick={() => void updateParticipant(p.id, { ruck_time: p.ruck_time?.trim() || null })}>{savingId === p.id ? "Saving..." : "Save time"}</button></td>
            <td className="organizer-status-cell"><label className="sr-only" htmlFor={"completion-" + p.id}>Completion status for {p.full_name}</label><select id={"completion-" + p.id} value={p.completion_status} onChange={(e) => setParticipants((current) => current.map((item) => item.id === p.id ? { ...item, completion_status: e.target.value as CompletionStatus } : item))}><option>Registered</option><option>Checked In</option><option>Completed</option><option>Did Not Complete</option></select><button className="organizer-save-button" type="button" disabled={savingId === p.id} onClick={() => void updateParticipant(p.id, { completion_status: p.completion_status })}>Save status</button></td>
            <td>{new Date(p.created_at).toLocaleDateString()}</td>{showContacts && <td>{p.emergency_contact_name}<span>{p.emergency_contact_relationship} · {p.emergency_contact_phone}</span></td>}
            <td>{p.registration_status === "Active" ? <button className="organizer-delete-button" type="button" disabled={busyId === p.id} onClick={async () => { if (!window.confirm("Mark " + p.full_name + " as withdrawn? Their record will be retained.")) return; setBusyId(p.id); await updateParticipant(p.id, { registration_status: "Withdrawn" }); setBusyId(null); }}>{busyId === p.id ? "Saving..." : "Withdraw"}</button> : "Record retained"}</td>
          </tr>)}{!filteredParticipants.length && <tr><td colSpan={showContacts ? 11 : 10} className="organizer-empty">No participant registrations match this search.</td></tr>}</tbody>
        </table></div>
        <p className="organizer-sensitive-note">Participant and emergency contact information is sensitive. Share exports only with authorized event personnel.</p>
      </section> : <section className="organizer-table-panel">
        <div className="organizer-table-heading"><div><p className="eyebrow">Volunteer records</p><h2>Volunteers</h2><p>{volunteers.length} volunteer registrations</p></div><button className="btn btn-primary" onClick={exportVolunteers} disabled={!volunteers.length}>Export volunteers CSV</button></div>
        <div className="organizer-summary volunteer-assignment-summary">{assignments.map((assignment) => <div key={assignment}><span>{assignment}</span><strong>{volunteers.filter((v) => v.assignment === assignment).length}</strong></div>)}</div>
        <div className="organizer-table-scroll"><table className="organizer-table"><thead><tr><th>Volunteer</th><th>Assignment</th><th>Registered</th>{showContacts && <th>Emergency contact</th>}</tr></thead><tbody>
          {volunteers.map((v) => <tr key={v.id}><td><strong>{v.full_name}</strong><span>{v.email}</span></td><td>{v.assignment}</td><td>{new Date(v.created_at).toLocaleDateString()}</td>{showContacts && <td>{v.emergency_contact_name}<span>{v.emergency_contact_relationship} · {v.emergency_contact_phone}</span></td>}</tr>)}
          {!volunteers.length && <tr><td colSpan={showContacts ? 4 : 3} className="organizer-empty">No volunteer registrations yet.</td></tr>}
        </tbody></table></div>
        <p className="organizer-sensitive-note">Volunteer and emergency contact information is sensitive. Share exports only with authorized event personnel.</p>
      </section>}
    </div></main>
  );
}
