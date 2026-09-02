import type { AccountRole } from "../supabase/database.types";

export type AdminDecision =
  | { allowed: true }
  | { allowed: false; status: 401 | 403; error: "Unauthorized" | "Forbidden" };

export function authorizeAdminRole(role: AccountRole | null, authenticated: boolean): AdminDecision {
  if (!authenticated) return { allowed: false, status: 401, error: "Unauthorized" };
  if (role !== "admin") return { allowed: false, status: 403, error: "Forbidden" };
  return { allowed: true };
}
