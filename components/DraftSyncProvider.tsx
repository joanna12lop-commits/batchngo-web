"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  PROJECT_DRAFT_SESSION_KEY,
  PROJECT_DRAFT_STORAGE_KEY,
  readProjectDraft,
} from "../lib/project-draft";
import {
  MANUFACTURER_APPLICATION_DRAFT_SESSION_KEY,
  MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY,
  readManufacturerApplicationDraft,
} from "../lib/manufacturer-application-draft";
import { createClient } from "../lib/supabase/client";
import { syncDraft } from "../lib/draft-sync";
import { isSupabaseConfigured } from "../lib/supabase/config";

type Kind = "project" | "manufacturer";
type Status = "idle" | "saving" | "saved" | "offline" | "failed";

const ownerKey = (kind: Kind) => `batchngo-${kind}-draft-owner`;
const hydratedKey = (kind: Kind) => `batchngo-${kind}-hydrated`;
const storageKey = (kind: Kind) =>
  kind === "project"
    ? PROJECT_DRAFT_STORAGE_KEY
    : MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY;
const sessionKey = (kind: Kind) =>
  kind === "project"
    ? PROJECT_DRAFT_SESSION_KEY
    : MANUFACTURER_APPLICATION_DRAFT_SESSION_KEY;

function separateForeignDraft(kind: Kind, userId: string) {
  const knownOwner = sessionStorage.getItem(ownerKey(kind));
  if (!knownOwner || knownOwner === userId) return;

  const rawDraft =
    localStorage.getItem(storageKey(kind)) ??
    sessionStorage.getItem(sessionKey(kind));
  if (rawDraft)
    sessionStorage.setItem(`${sessionKey(kind)}:${knownOwner}`, rawDraft);
  localStorage.removeItem(storageKey(kind));
  sessionStorage.removeItem(sessionKey(kind));
  sessionStorage.removeItem(hydratedKey(kind));
  sessionStorage.removeItem(ownerKey(kind));
}

export default function DraftSyncProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timers = useRef<Partial<Record<Kind, number>>>({});

  const sync = useCallback(async (kind: Kind, userId?: string) => {
    if (!navigator.onLine) {
      setStatus("offline");
      return false;
    }

    const draft =
      kind === "project"
        ? readProjectDraft()
        : readManufacturerApplicationDraft();
    if (!draft) return true;

    const knownOwner = sessionStorage.getItem(ownerKey(kind));
    if (knownOwner && userId && knownOwner !== userId) {
      setStatus("failed");
      return false;
    }

    setStatus("saving");
    const result = await syncDraft(kind, draft);
    if (result.ok) {
      if (userId) {
        sessionStorage.setItem(ownerKey(kind), userId);
        sessionStorage.setItem(sessionKey(kind), JSON.stringify(draft));
        localStorage.removeItem(storageKey(kind));
      }
      setStatus("saved");
      return true;
    }
    if (result.status === 401) return false;
    setStatus(navigator.onLine ? "failed" : "offline");
    return false;
  }, []);

  const hydrate = useCallback(async (kind: Kind, userId: string) => {
    if (
      localStorage.getItem(storageKey(kind)) ||
      sessionStorage.getItem(sessionKey(kind))
    )
      return;
    try {
      const response = await fetch(`/api/drafts/${kind}`, {
        credentials: "include",
      });
      if (!response.ok) return;

      // Safe JSON parse: first read text, handle empty body, then parse
      const text = await response.text().catch(() => "");
      if (!text) return;
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Not JSON — ignore
        return;
      }
      const { draft } = parsed as { draft: unknown };
      if (!draft) return;

      sessionStorage.setItem(sessionKey(kind), JSON.stringify(draft));
      sessionStorage.setItem(ownerKey(kind), userId);
      if (
        !sessionStorage.getItem(hydratedKey(kind)) &&
        window.location.pathname.includes(
          kind === "project" ? "post-project" : "for-manufacturers/apply",
        )
      ) {
        sessionStorage.setItem(hydratedKey(kind), "1");
        window.location.reload();
      }
    } catch {
      setStatus(navigator.onLine ? "failed" : "offline");
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const activeTimers = timers.current;

    const connect = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      separateForeignDraft("project", user.id);
      separateForeignDraft("manufacturer", user.id);
      await sync("project", user.id);
      await sync("manufacturer", user.id);
      await hydrate("project", user.id);
      await hydrate("manufacturer", user.id);
    };

    void connect();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        [
          PROJECT_DRAFT_SESSION_KEY,
          MANUFACTURER_APPLICATION_DRAFT_SESSION_KEY,
        ].forEach((key) => sessionStorage.removeItem(key));
        return;
      }
      if (session?.user) setTimeout(() => void connect(), 0);
    });

    const changed = (event: Event) => {
      const kind = (event as CustomEvent<{ kind: Kind }>).detail?.kind;
      if (!kind) return;
      window.clearTimeout(activeTimers[kind]);
      activeTimers[kind] = window.setTimeout(async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          void sync(kind, user.id);
        } else {
          sessionStorage.removeItem(ownerKey(kind));
        }
      }, 500);
    };
    const online = () => {
      setStatus("idle");
      void connect();
    };
    const offline = () => setStatus("offline");

    window.addEventListener("batchngo:draft-changed", changed);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("batchngo:draft-changed", changed);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      Object.values(activeTimers).forEach((timer) =>
        window.clearTimeout(timer),
      );
    };
  }, [hydrate, sync]);

  const labels: Record<Exclude<Status, "idle">, string> = {
    saving: "Saving…",
    saved: "Saved",
    offline: "Offline — saved on this device",
    failed: "Save failed — your local draft is safe",
  };

  return (
    <>
      {children}
      {status !== "idle" ? (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-[90] rounded-full border px-4 py-2 text-sm font-semibold shadow-lg ${
            status === "failed"
              ? "border-[#C9826B] bg-[#F5E6E0] text-[#7A3F31]"
              : "border-[#E5E0D8] bg-white text-[#1F2937]"
          }`}
        >
          {labels[status]}
        </div>
      ) : null}
    </>
  );
}
