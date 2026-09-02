import { NextResponse } from "next/server";
import { recordAdminEvent } from "../../../../../lib/admin/audit";
import { getAdminContext, isUuid } from "../../../../../lib/admin/server";
import type { ProjectStatus } from "../../../../../lib/supabase/database.types";

const statuses: ProjectStatus[] = ["draft", "submitted", "under_review", "matched", "closed", "rejected"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context.ok) return NextResponse.json({ error: context.error }, { status: context.status });
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid project identifier." }, { status: 400 });
  const body = await request.json().catch(() => null) as { status?: unknown; note?: unknown } | null;
  if (!body || (body.status === undefined && body.note === undefined)) {
    return NextResponse.json({ error: "No supported change was provided." }, { status: 400 });
  }

  const { data: project } = await context.admin.from("projects").select("id,customer_id,status").eq("id", id).maybeSingle();
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !statuses.includes(body.status as ProjectStatus)) {
      return NextResponse.json({ error: "Invalid project status." }, { status: 400 });
    }
    const status = body.status as ProjectStatus;
    const { error } = await context.admin.from("projects").update({ status }).eq("id", id);
    if (error) return NextResponse.json({ error: "Unable to update project status." }, { status: 500 });
    await context.admin.from("notifications").insert({
      recipient_id: project.customer_id,
      type: "project_status_changed",
      title: "Your project status changed",
      body: `Your project is now ${status.replaceAll("_", " ")}.`,
      data: { projectId: id, status },
    });
    await recordAdminEvent(context.admin, context.user.id, "project.status_changed", "project", id, { from: project.status, to: status });
  }

  if (body.note !== undefined) {
    if (typeof body.note !== "string" || !body.note.trim() || body.note.length > 10000) {
      return NextResponse.json({ error: "Enter an internal note of up to 10,000 characters." }, { status: 400 });
    }
    const note = body.note.trim();
    const { error } = await context.admin.from("admin_notes").upsert(
      { entity_type: "project", entity_id: id, note, created_by: context.user.id },
      { onConflict: "entity_type,entity_id" },
    );
    if (error) return NextResponse.json({ error: "Unable to save the internal note." }, { status: 500 });
    await recordAdminEvent(context.admin, context.user.id, "project.note_updated", "project", id, { noteLength: note.length });
  }
  return NextResponse.json({ updated: true });
}
