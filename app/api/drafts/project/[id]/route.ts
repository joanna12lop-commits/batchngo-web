import { NextResponse } from "next/server";
import { getContext } from "../context";

export async function handleGet(
  id: string,
  getContextFunc: typeof getContext = getContext,
) {
  const ctx = await getContextFunc();
  if (!ctx)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await ctx.supabase
    .from("projects")
    .select("technical_details")
    .eq("id", id)
    .eq("customer_id", ctx.user.id)
    .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "Unable to load project" },
      { status: 500 },
    );
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const payload = data.technical_details;
  if (payload && typeof payload === "object" && "draft" in payload)
    return NextResponse.json({ draft: payload.draft });
  return NextResponse.json({ draft: null });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    return handleGet(id);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export default GET;
