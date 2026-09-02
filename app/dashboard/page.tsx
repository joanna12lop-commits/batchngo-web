import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
export default async function DashboardPage(){await connection();const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login?next=/dashboard");const{data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();if(profile?.role==="customer")redirect("/dashboard/projects");if(profile?.role==="manufacturer")redirect("/dashboard/matches");if(profile?.role==="admin")redirect("/admin");redirect("/account");}
