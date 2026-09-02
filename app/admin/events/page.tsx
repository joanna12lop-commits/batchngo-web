import { getAdminContext } from "../../../lib/admin/server";

export default async function AdminEventsPage() {
  const context = await getAdminContext();
  if (!context.ok) return null;
  const { data: result } = await context.admin.from("admin_events").select("*").order("created_at", { ascending: false }).limit(300);
  const data = result ?? [];
  return <main className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C8A6A]">Audit trail</p><h1 className="mt-2 text-4xl font-semibold">Admin activity</h1><div className="mt-8 overflow-x-auto rounded-[24px] border border-[#E5E0D8] bg-white"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#EEEAE3] text-xs uppercase tracking-wider text-[#7C7A74]"><tr><th className="p-4">Time</th><th className="p-4">Event</th><th className="p-4">Entity</th><th className="p-4">Actor</th><th className="p-4">Details</th></tr></thead><tbody>{data.map((event)=><tr key={event.id} className="border-t border-[#E5E0D8] align-top"><td className="whitespace-nowrap p-4">{new Date(event.created_at).toLocaleString("en-US")}</td><td className="p-4 font-bold">{event.event_type}</td><td className="p-4">{event.entity_type}<span className="mt-1 block font-mono text-xs text-[#7C7A74]">{event.entity_id||"—"}</span></td><td className="p-4 font-mono text-xs">{event.actor_id||"System"}</td><td className="max-w-md p-4"><pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5">{JSON.stringify(event.payload,null,2)}</pre></td></tr>)}</tbody></table>{!data.length?<p className="p-10 text-center text-sm text-[#7C7A74]">No administrative events yet.</p>:null}</div></main>;
}
