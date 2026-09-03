export type Kind = "project" | "manufacturer";

export async function syncDraft(kind: Kind, draft: unknown) {
  if (!draft) return { ok: true };
  try {
    const response = await fetch(`/api/drafts/${kind}`, {
      method: "PUT",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ draft }),
    });
    if (response.status === 401) return { ok: false, status: 401 };
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      let body: Record<string, unknown> | null = null;
      if (text) {
        try {
          body = JSON.parse(text) as Record<string, unknown>;
        } catch {
          body = { error: text };
        }
      }
      return {
        ok: false,
        status: response.status,
        error:
          (body &&
            (String((body.error ?? body.message) as string) || String(text))) ||
          "Save failed",
      };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export default syncDraft;
