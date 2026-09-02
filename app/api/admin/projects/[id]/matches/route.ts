import { NextResponse } from "next/server";
import { recordAdminEvent } from "../../../../../../lib/admin/audit";
import { getAdminContext, isUuid } from "../../../../../../lib/admin/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { id } = await params;
  const body = await request.json().catch(() => null) as { manufacturerProfileIds?: unknown } | null;
  const ids = body?.manufacturerProfileIds;
  if (!isUuid(id) || !Array.isArray(ids) || !ids.length || ids.length > 50 || !ids.every(isUuid)) {
    return NextResponse.json({ error: "Select between 1 and 50 valid manufacturers." }, { status: 400 });
  }
  const uniqueIds = [...new Set(ids)];
  const { data: project } = await context.admin.from("projects").select("id,customer_id,status").eq("id", id).maybeSingle();
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  const { data: manufacturers } = await context.admin.from("manufacturer_profiles").select("id,owner_id,business_name").in("id", uniqueIds).eq("status", "approved");
  if (!manufacturers || manufacturers.length !== uniqueIds.length) {
    return NextResponse.json({ error: "Every selected manufacturer must be approved." }, { status: 400 });
  }
  const { error } = await context.admin.from("project_matches").upsert(
    uniqueIds.map((manufacturerProfileId) => ({ project_id: id, manufacturer_profile_id: manufacturerProfileId, matched_by: context.user.id, status: "invited" as const })),
    { onConflict: "project_id,manufacturer_profile_id", ignoreDuplicates: true },
  );
  if (error) return NextResponse.json({ error: "Unable to assign manufacturers." }, { status: 500 });
  await context.admin.from("projects").update({ status: "matched" }).eq("id", id);
  await context.admin.from("notifications").insert([
    { recipient_id: project.customer_id, type: "project_matched", title: "Maker matching has started", body: "Approved makers have been invited to review your project.", data: { projectId: id } },
    ...manufacturers.map((manufacturer) => ({ recipient_id: manufacturer.owner_id, type: "project_invitation", title: "New matched project", body: "A project matching your capabilities is ready to review.", data: { projectId: id } })),
  ]);
  await recordAdminEvent(context.admin, context.user.id, "project.manufacturers_assigned", "project", id, { manufacturerProfileIds: uniqueIds });
  return NextResponse.json({ matched: true, count: uniqueIds.length });
}
