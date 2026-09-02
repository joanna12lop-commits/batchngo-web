import "server-only";
import type { Json } from "../supabase/database.types";
type Client=ReturnType<typeof import("../supabase/admin").createAdminClient>;
export async function createMarketplaceNotification(client:Client,input:{recipientId:string;type:string;title:string;body:string;data?:Json}){await client.from("notifications").insert({recipient_id:input.recipientId,type:input.type,title:input.title,body:input.body,data:input.data??{}});// TODO: Enqueue a transactional email here when the MVP email provider is configured.
}
