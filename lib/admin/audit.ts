import "server-only";
import type { Json } from "../supabase/database.types";

type AdminClient = ReturnType<typeof import("../supabase/admin").createAdminClient>;

export async function recordAdminEvent(
  admin: AdminClient,
  actorId: string,
  eventType: string,
  entityType: string,
  entityId: string,
  payload: Json = {},
) {
  const { error } = await admin.from("admin_events").insert({
    actor_id: actorId,
    event_type: eventType,
    entity_type: entityType,
    entity_id: entityId,
    payload,
  });
  if (error) throw new Error(`Unable to record admin event: ${error.message}`);
}
