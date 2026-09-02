"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

async function mutate(endpoint: string, method: "PATCH" | "POST", body: object) {
  const response = await fetch(endpoint, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) throw new Error(payload.error || "The admin operation failed.");
}

export function StatusControl({ endpoint, initialStatus, options }: { endpoint: string; initialStatus: string; options: string[] }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const save = async () => { setState("saving"); try { await mutate(endpoint, "PATCH", { status }); setState("saved"); router.refresh(); } catch { setState("error"); } };
  return <div><label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7C7A74]">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#E5E0D8] bg-white px-3 text-sm font-medium">{options.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}</select></label><button type="button" onClick={save} disabled={state === "saving"} className="mt-3 w-full rounded-full bg-[#7C8A6A] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{state === "saving" ? "Saving…" : "Update status"}</button>{state === "saved" ? <p role="status" className="mt-2 text-xs text-[#667255]">Status saved.</p> : null}{state === "error" ? <p role="alert" className="mt-2 text-xs text-[#9A4F3D]">Status update failed.</p> : null}</div>;
}

export function NoteControl({ endpoint, initialNote }: { endpoint: string; initialNote: string }) {
  const [note, setNote] = useState(initialNote);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const save = async () => { setState("saving"); try { await mutate(endpoint, "PATCH", { note }); setState("saved"); } catch { setState("error"); } };
  return <div><label className="text-xs font-bold uppercase tracking-[0.16em] text-[#7C7A74]">Internal note<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={6} maxLength={10000} className="mt-2 w-full rounded-2xl border border-[#E5E0D8] bg-white p-4 text-sm leading-6" placeholder="Visible only to administrators" /></label><button type="button" onClick={save} disabled={!note.trim() || state === "saving"} className="mt-3 rounded-full border border-[#7C8A6A] px-5 py-2 text-sm font-bold text-[#667255] disabled:opacity-40">{state === "saving" ? "Saving…" : "Save note"}</button>{state === "saved" ? <span role="status" className="ml-3 text-xs text-[#667255]">Saved</span> : null}{state === "error" ? <p role="alert" className="mt-2 text-xs text-[#9A4F3D]">Note could not be saved.</p> : null}</div>;
}

type MatchOption = { id: string; name: string; detail: string };
export function MatchControl({ endpoint, manufacturers }: { endpoint: string; manufacturers: MatchOption[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const assign = async () => { setState("saving"); try { await mutate(endpoint, "POST", { manufacturerProfileIds: selected }); setState("saved"); setSelected([]); router.refresh(); } catch { setState("error"); } };
  return <div className="space-y-3">{manufacturers.length ? manufacturers.map((maker) => <label key={maker.id} className="flex cursor-pointer gap-3 rounded-2xl border border-[#E5E0D8] bg-white p-4"><input type="checkbox" checked={selected.includes(maker.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, maker.id] : current.filter((id) => id !== maker.id))} /><span><strong className="block text-sm">{maker.name}</strong><span className="text-xs leading-5 text-[#7C7A74]">{maker.detail}</span></span></label>) : <p className="rounded-2xl border border-dashed border-[#D3CDC2] p-4 text-sm text-[#7C7A74]">No approved manufacturers match these filters.</p>}<button type="button" onClick={assign} disabled={!selected.length || state === "saving"} className="rounded-full bg-[#7C8A6A] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{state === "saving" ? "Assigning…" : `Assign selected (${selected.length})`}</button>{state === "saved" ? <p role="status" className="text-xs text-[#667255]">Manufacturers assigned.</p> : null}{state === "error" ? <p role="alert" className="text-xs text-[#9A4F3D]">Assignment failed.</p> : null}</div>;
}
