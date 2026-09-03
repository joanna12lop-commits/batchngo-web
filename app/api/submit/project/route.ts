import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { validateProjectDraft } from "../../../../lib/drafts/validation";
import type { Json } from "../../../../lib/supabase/database.types";

const columns = "id,status";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "customer") return NextResponse.json({ error: "Customer account required" }, { status: 403 });

  const body: unknown = await request.json().catch(() => null);
  const value = body && typeof body === "object" && "draft" in body ? (body as { draft: unknown }).draft : null;
  const result = validateProjectDraft(value, true);
  if (!result.ok) return NextResponse.json({ error: "Validation failed", details: result.errors }, { status: 400 });
  const draft = result.data;

  const { data: existing, error: findError } = await supabase.from("projects").select(columns)
    .eq("customer_id", user.id).eq("client_draft_id", draft.draftId).maybeSingle();
  if (findError) {
    console.error("project_submit_lookup_failed", { code: findError.code, projectId: null });
    return NextResponse.json({ error: "Unable to locate the project draft." }, { status: 500 });
  }

  const mutableFields = {
    title: draft.step1.projectTitle, description: draft.step1.description,
    status: "submitted" as const, technical_details: { draft } as unknown as Json,
    quantity: Number(draft.step3.orderQuantity),
    minimum_budget_cents: draft.step3.minimumBudget ? Math.round(Number(draft.step3.minimumBudget) * 100) : null,
    maximum_budget_cents: draft.step3.maximumBudget ? Math.round(Number(draft.step3.maximumBudget) * 100) : null,
    currency: "USD" as const, timeline: draft.step4 as unknown as Json,
    shipping_address: { city: draft.step4.shippingCity, state: draft.step4.shippingState, zipCode: draft.step4.shippingZipCode, country: "United States" } as Json,
    submitted_at: new Date().toISOString(),
  };

  let projectId: string | null = existing?.id ?? null;
  if (existing?.status === "draft") {
    // Do not include identity columns here. Authenticated users intentionally
    // have no UPDATE privilege on customer_id or client_draft_id.
    const { data, error } = await supabase.from("projects").update(mutableFields)
      .eq("id", existing.id).eq("customer_id", user.id).eq("status", "draft")
      .select(columns).maybeSingle();
    if (error) {
      console.error("project_submit_update_failed", { code: error.code, projectId: existing.id });
      return NextResponse.json({ error: "Unable to submit project." }, { status: 500 });
    }
    projectId = data?.id ?? existing.id;
  } else if (!existing) {
    const { data, error } = await supabase.from("projects").insert({
      customer_id: user.id,
      client_draft_id: draft.draftId,
      ...mutableFields,
    }).select(columns).single();
    if (error) {
      console.error("project_submit_insert_failed", { code: error.code, projectId: null });
      return NextResponse.json({ error: "Unable to submit project." }, { status: 500 });
    }
    projectId = data.id;
  }

  const { data: verified, error: verifyError } = await supabase.from("projects").select(columns)
    .eq("id", projectId as string).eq("customer_id", user.id).maybeSingle();
  if (verifyError || !verified || verified.status !== "submitted") {
    return NextResponse.json({ error: "Project submission could not be verified.", id: projectId, status: verified?.status ?? null }, { status: 500 });
  }
  return NextResponse.json({ submitted: true, id: verified.id, status: verified.status });
}
