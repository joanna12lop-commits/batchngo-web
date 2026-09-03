"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { writeProjectDraft } from "../lib/project-draft";

export default function ResumeDraftButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResume = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/drafts/project/${projectId}`, {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push(`/login?next=/dashboard/projects/${projectId}`);
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let body = null;
        if (text) {
          try {
            body = JSON.parse(text);
          } catch {}
        }
        throw new Error(body?.error || "Unable to load project draft");
      }
      const body = await res.json();
      if (!body || !body.draft) throw new Error("No draft found on server");
      // write into local storage so the post-project flow can resume
      writeProjectDraft(body.draft);
      // Navigate to the post-project review page where the draft will be loaded
      router.push("/post-project/review");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleResume}
        disabled={loading}
        className="rounded-full bg-[#7C8A6A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        {loading ? "Loading…" : "Continue editing"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
