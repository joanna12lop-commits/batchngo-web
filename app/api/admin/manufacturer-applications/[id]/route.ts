import { NextResponse } from "next/server";
import { recordAdminEvent } from "../../../../../lib/admin/audit";
import { getAdminContext, isUuid } from "../../../../../lib/admin/server";
import type { Json, ManufacturerApplicationStatus } from "../../../../../lib/supabase/database.types";

const statuses: ManufacturerApplicationStatus[] = ["draft", "submitted", "under_review", "approved", "rejected"];
const object = (value: unknown): Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const text = (value: unknown) => typeof value === "string" ? value : "";
const positive = (value: unknown) => { const number = Number(value); return Number.isFinite(number) && number > 0 ? number : null; };

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { id } = await params;
  const body = await request.json().catch(() => null) as { status?: unknown; note?: unknown } | null;
  if (!isUuid(id) || !body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { data: application } = await context.admin.from("manufacturer_applications").select("*").eq("id", id).maybeSingle();
  if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });

  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !statuses.includes(body.status as ManufacturerApplicationStatus)) {
      return NextResponse.json({ error: "Invalid application status." }, { status: 400 });
    }
    const status = body.status as ManufacturerApplicationStatus;
    let manufacturerProfileId = application.manufacturer_profile_id;
    if (status === "approved") {
      const draft = object(object(application.application_data).draft);
      const step1 = object(draft.step1), step2 = object(draft.step2), step3 = object(draft.step3);
      const businessName = text(step1.businessName).trim();
      if (!businessName) return NextResponse.json({ error: "The application has no valid business name." }, { status: 400 });
      const slugBase = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "manufacturer";
      const profileRow = {
        owner_id: application.owner_id, slug: `${slugBase}-${application.owner_id.slice(0, 8)}`, business_name: businessName,
        supplier_types: strings(step1.supplierTypes), business_location: { city: text(step1.businessCity), state: text(step1.businessState), zipCode: text(step1.businessZipCode), country: "United States" } as Json,
        facility_location: { city: text(step3.facilityCity), state: text(step3.facilityState), zipCode: text(step3.facilityZipCode), country: "United States" } as Json,
        shipping_regions: strings(step3.shippingRegions), shipping_states: strings(step3.shippingStates), packaging_types: strings(step2.packagingTypes), materials: strings(step2.materials), printing_methods: strings(step2.printingMethods), finishing_capabilities: strings(step2.finishingCapabilities), filling_capabilities: strings(step2.fillingCapabilities), industries_served: strings(step2.industriesServed),
        assembly_and_kitting: step2.assemblyAndKitting === true, sample_available: text(step3.sampleAvailable) === "Yes", prototype_available: step2.prototypeAvailable === true,
        typical_moq: positive(step3.minimumOrderQuantity), lead_time_days: positive(step3.typicalLeadTime), monthly_capacity: positive(step3.monthlyCapacity), us_based_company: step1.usBasedCompany === true, us_manufacturing: step1.usManufacturing === true, origin_claim: text(step1.originClaim) || null, description: text(step1.capabilitiesDescription) || null, status: "approved" as const,
      };
      const { data: manufacturerProfile, error } = await context.admin.from("manufacturer_profiles").upsert(profileRow, { onConflict: "owner_id" }).select("id").single();
      if (error) return NextResponse.json({ error: "Unable to create the approved manufacturer profile." }, { status: 500 });
      manufacturerProfileId = manufacturerProfile.id;
    }
    const { error } = await context.admin.from("manufacturer_applications").update({ status, manufacturer_profile_id: manufacturerProfileId, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) return NextResponse.json({ error: "Unable to update the application." }, { status: 500 });
    await context.admin.from("notifications").insert({ recipient_id: application.owner_id, type: "manufacturer_application_status", title: "Application status updated", body: `Your manufacturer application is now ${status.replaceAll("_", " ")}.`, data: { applicationId: id, status } });
    await recordAdminEvent(context.admin, context.user.id, "manufacturer_application.status_changed", "manufacturer_application", id, { from: application.status, to: status, manufacturerProfileId });
  }
  if (body.note !== undefined) {
    if (typeof body.note !== "string" || !body.note.trim() || body.note.length > 10000) return NextResponse.json({ error: "Enter an internal note of up to 10,000 characters." }, { status: 400 });
    const note = body.note.trim();
    const { error } = await context.admin.from("admin_notes").upsert({ entity_type: "manufacturer_application", entity_id: id, note, created_by: context.user.id }, { onConflict: "entity_type,entity_id" });
    if (error) return NextResponse.json({ error: "Unable to save the internal note." }, { status: 500 });
    await recordAdminEvent(context.admin, context.user.id, "manufacturer_application.note_updated", "manufacturer_application", id, { noteLength: note.length });
  }
  return NextResponse.json({ updated: true });
}
