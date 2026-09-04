import type { Database } from "../supabase/database.types";

export type MatchStatus =
  Database["public"]["Tables"]["project_matches"]["Row"]["status"];

export type ManufacturerMatchResponse = "viewed" | "interested" | "declined";

const manufacturerTransitions: Readonly<
  Partial<Record<MatchStatus, readonly ManufacturerMatchResponse[]>>
> = {
  invited: ["viewed", "interested", "declined"],
  viewed: ["interested", "declined"],
  interested: ["declined"],
};

export function canManufacturerTransitionMatch(
  current: MatchStatus,
  next: MatchStatus,
) {
  return (
    manufacturerTransitions[current]?.includes(
      next as ManufacturerMatchResponse,
    ) ?? false
  );
}

export function isManufacturerQuoteInitialStatus(
  status: "draft" | "submitted" | "accepted" | "declined" | "withdrawn",
) {
  return status === "draft" || status === "submitted";
}
