export async function submitDraft(draft: unknown) {
  const response = await fetch("/api/submit/project", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ draft }),
  });
  const text = await response.text().catch(() => "");
  let body: {
    error?: string;
    details?: string[];
    submitted?: boolean;
    id?: string;
    status?: string;
  } | null = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }
  return { response, body };
}

export default submitDraft;
