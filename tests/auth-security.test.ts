import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { authorizeAdminRole } from "../lib/admin/authorization.ts";
import { isProtectedPath, loginRedirectUrl, safeRedirectPath } from "../lib/auth/redirects.ts";
import { isSupabaseConfigured } from "../lib/supabase/config.ts";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("public and private routes are classified without protecting local draft forms", () => {
  for (const path of ["/dashboard", "/dashboard/projects/1", "/account", "/account/settings", "/admin", "/admin/projects"]) assert.equal(isProtectedPath(path), true);
  for (const path of ["/", "/find-makers", "/makers/example", "/post-project/details", "/for-manufacturers/apply", "/blog"]) assert.equal(isProtectedPath(path), false);
});

test("unauthenticated redirects preserve only safe internal return paths", () => {
  assert.equal(loginRedirectUrl("https://batchngo.test/dashboard/projects?status=draft").toString(), "https://batchngo.test/login?next=%2Fdashboard%2Fprojects%3Fstatus%3Ddraft");
  assert.equal(safeRedirectPath("/dashboard/projects?status=draft"), "/dashboard/projects?status=draft");
  for (const unsafe of ["https://evil.test", "//evil.test/path", "/\\evil.test", "javascript:alert(1)"]) assert.equal(safeRedirectPath(unsafe), "/dashboard");
});

test("admin authorization denies anonymous, ordinary, and missing roles", () => {
  assert.equal(authorizeAdminRole(null, false).allowed, false);
  assert.equal(authorizeAdminRole(null, true).allowed, false);
  assert.equal(authorizeAdminRole("customer", true).allowed, false);
  assert.equal(authorizeAdminRole("manufacturer", true).allowed, false);
  assert.equal(authorizeAdminRole("admin", true).allowed, true);
});

test("missing Supabase configuration is detectable without creating a client", () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  assert.equal(isSupabaseConfigured(), false);
  if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
  if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
});

test("browser Supabase modules never reference the service-role key", () => {
  const browserSources = [source("lib/supabase/client.ts"), source("lib/supabase/config.ts"), source("components/HeaderAuth.tsx")].join("\n");
  assert.equal(browserSources.includes("SUPABASE_SERVICE_ROLE_KEY"), false);
  assert.match(browserSources, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
});

test("logout clears the Supabase session and returns to a public page", () => {
  const logout = source("app/account/actions.ts");
  assert.match(logout, /auth\.signOut\(\)/);
  assert.match(logout, /redirect\("\/"\)/);
});

test("RLS migrations protect user data and harden ownership columns", () => {
  const initial = source("supabase/migrations/202608070001_mvp_backend.sql");
  const hardening = source("supabase/migrations/202609030001_auth_rls_hardening.sql");
  for (const table of ["profiles", "manufacturer_profiles", "manufacturer_applications", "projects", "project_files", "project_matches", "quotes", "notifications", "admin_events"]) {
    assert.match(initial, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
  }
  assert.doesNotMatch(initial + hardening, /(?:using|with check)\s*\(\s*true\s*\)/i);
  assert.match(hardening, /revoke update on public\.quotes from authenticated/i);
  assert.match(hardening, /mp\.owner_id = \(select auth\.uid\(\)\)/i);
  assert.match(initial, /revoke all on public\.admin_events from anon,authenticated/i);
});

test("project owners can submit without receiving ownership-column update privileges", () => {
  const submission = source("app/api/submit/project/route.ts");
  const migration = source("supabase/migrations/202609030003_allow_owner_project_submission.sql");

  assert.match(submission, /update\(mutableFields\)/);
  assert.doesNotMatch(migration, /grant update\s*\([^)]*customer_id/i);
  assert.doesNotMatch(migration, /grant update\s*\([^)]*client_draft_id/i);
  assert.match(migration, /grant update\s*\([^)]*status/i);
  assert.match(migration, /using\s*\(\s*customer_id\s*=\s*\(select auth\.uid\(\)\)/i);
  assert.match(migration, /with check\s*\(\s*customer_id\s*=\s*\(select auth\.uid\(\)\)/i);
  assert.doesNotMatch(migration, /(?:from|join)\s+public\.project_matches/i);
});
