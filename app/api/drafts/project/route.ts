import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { validateProjectDraft } from "../../../../lib/drafts/validation";
import type { Json } from "../../../../lib/supabase/database.types";

async function context() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return profile?.role === "customer" ? { supabase, user } : null;
}

export async function GET() {
  const ctx = await context();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await ctx.supabase.from("projects").select("technical_details")
    .eq("customer_id", ctx.user.id).eq("status", "draft")
    .order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (error) return NextResponse.json({ error: "Unable to load the project draft." }, { status: 500 });
  const payload = data?.technical_details;
  if (payload && typeof payload === "object" && !Array.isArray(payload) && "draft" in payload)
    return NextResponse.json({ draft: payload.draft });
  return NextResponse.json({ draft: null });
}

export async function PUT(request: Request) {
  const ctx = await context();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  const value = body && typeof body === "object" && "draft" in body ? (body as { draft: unknown }).draft : null;
  const result = validateProjectDraft(value, false);
  if (!result.ok) return NextResponse.json({ error: "Invalid draft", details: result.errors }, { status: 400 });
  const draft = result.data;
  const fields = {
    title: draft.step1.projectTitle || "Untitled project",
    description: draft.step1.description || "Draft project",
    technical_details: { draft } as unknown as Json,
    quantity: draft.step3.orderQuantity ? Number(draft.step3.orderQuantity) : null,
    minimum_budget_cents: draft.step3.minimumBudget ? Math.round(Number(draft.step3.minimumBudget) * 100) : null,
    maximum_budget_cents: draft.step3.maximumBudget ? Math.round(Number(draft.step3.maximumBudget) * 100) : null,
    currency: "USD" as const, timeline: draft.step4 as unknown as Json,
    shipping_address: { city: draft.step4.shippingCity, state: draft.step4.shippingState, zipCode: draft.step4.shippingZipCode, country: "United States" } as Json,
  };

  const { data: before, error: findError } = await ctx.supabase.from("projects").select("id,status")
    .eq("customer_id", ctx.user.id).eq("client_draft_id", draft.draftId).maybeSingle();
  if (findError) {
    console.error("project_draft_put_lookup_failed", { code: findError.code, projectId: null });
    return NextResponse.json({ error: "Unable to save the project draft." }, { status: 500 });
  }

  let projectId = before?.id ?? null;
  if (before?.status === "draft") {
    const { error } = await ctx.supabase.from("projects").update(fields)
      .eq("id", before.id).eq("customer_id", ctx.user.id).eq("status", "draft");
    if (error) {
      console.error("project_draft_put_update_failed", { code: error.code, projectId: before.id });
      return NextResponse.json({ error: "Unable to save the project draft." }, { status: 500 });
    }
  } else if (!before) {
    const { data, error } = await ctx.supabase.from("projects").insert({
      customer_id: ctx.user.id, client_draft_id: draft.draftId, status: "draft" as const, ...fields,
    }).select("id").single();
    if (error) {
      console.error("project_draft_put_insert_failed", { code: error.code, projectId: null });
      return NextResponse.json({ error: "Unable to save the project draft." }, { status: 500 });
    }
    projectId = data.id;
  }

  const { data: after, error: verifyError } = await ctx.supabase.from("projects").select("id,status")
    .eq("id", projectId as string).eq("customer_id", ctx.user.id).maybeSingle();
  if (verifyError || !after) return NextResponse.json({ error: "Unable to verify the saved project draft." }, { status: 500 });
  return NextResponse.json({ saved: true, draftId: draft.draftId, projectId: after.id, status: after.status });
}
