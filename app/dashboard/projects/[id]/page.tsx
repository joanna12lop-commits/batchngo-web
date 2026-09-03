import Link from "next/link";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import ResumeDraftButton from "../../../../components/ResumeDraftButton";

const usd = (cents: number | null) =>
  cents === null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(cents / 100);

export default async function CustomerProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/dashboard/projects/${id}`);
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "customer") redirect("/dashboard");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("customer_id", user.id)
    .maybeSingle();
  if (!project) notFound();

  const { data: quoteResult } = await supabase
    .from("quotes")
    .select("*")
    .eq("project_id", id)
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true });
  const quotes = quoteResult ?? [];
  const makerIds = quotes.map((quote) => quote.manufacturer_profile_id);
  const { data: makerResult } = makerIds.length
    ? await supabase
        .from("manufacturer_profiles")
        .select("id,business_name,slug,supplier_types")
        .in("id", makerIds)
    : { data: [] };
  const makers = makerResult ?? [];

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
      <Link
        href="/dashboard/projects"
        className="text-sm font-bold text-[#667255]"
      >
        ← Your projects
      </Link>
      <header className="mt-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="rounded-full bg-[#EEF1E8] px-3 py-1 text-xs font-bold text-[#667255]">
              {project.status.replaceAll("_", " ")}
            </span>
            <h1 className="mt-4 text-4xl font-semibold">{project.title}</h1>
            <p className="mt-3 max-w-3xl text-[#7C7A74]">
              {project.description}
            </p>
          </div>
          {project.status === "draft" ? (
            <div className="ml-6">
              <ResumeDraftButton projectId={project.id} />
            </div>
          ) : null}
        </div>
      </header>
      <section className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Manufacturer quotes</h2>
            <p className="mt-2 text-sm text-[#7C7A74]">
              Compare non-binding estimates. Final scope and pricing still
              require direct confirmation.
            </p>
          </div>
          <span className="text-sm font-bold">{quotes.length} received</span>
        </div>
        {quotes.length ? (
          <div className="mt-5 overflow-x-auto rounded-[24px] border border-[#E5E0D8] bg-white">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-[#EEEAE3]">
                <tr>
                  <th className="p-4 text-left">Manufacturer</th>
                  <th className="p-4 text-left">Estimate</th>
                  <th className="p-4 text-left">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id}>
                    <td className="p-4">
                      {makers.find(
                        (m) => m.id === q.manufacturer_profile_id,
                      )?.business_name ?? "—"}
                    </td>
                    <td className="p-4">{usd(q.estimated_unit_price_cents)}</td>
                    <td className="p-4">{q.submitted_at ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 text-sm text-[#7C7A74]">No quotes yet.</p>
        )}
      </section>
    </main>
  );
}
