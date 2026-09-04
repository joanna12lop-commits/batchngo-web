import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  canManufacturerTransitionMatch,
  isManufacturerQuoteInitialStatus,
  type MatchStatus,
} from "../lib/matches/state-machine.ts";

const migration = readFileSync(
  new URL(
    "../supabase/migrations/202609040001_harden_manufacturer_match_quote_state.sql",
    import.meta.url,
  ),
  "utf8",
);

const matchStatuses: MatchStatus[] = [
  "invited",
  "viewed",
  "interested",
  "quoted",
  "accepted",
  "declined",
];
const allowed = new Set([
  "invited:viewed",
  "invited:interested",
  "invited:declined",
  "viewed:interested",
  "viewed:declined",
  "interested:declined",
]);

test("every manufacturer-controlled match transition is explicitly allowed or forbidden", () => {
  for (const current of matchStatuses) {
    for (const next of matchStatuses) {
      assert.equal(
        canManufacturerTransitionMatch(current, next),
        allowed.has(`${current}:${next}`),
        `${current} -> ${next}`,
      );
    }
  }
});

test("manufacturer response endpoint cannot directly request quoted or accepted", () => {
  const route = readFileSync(
    new URL("../app/api/matches/[id]/response/route.ts", import.meta.url),
    "utf8",
  );
  assert.match(route, /\["viewed","interested","declined"\]/);
  assert.doesNotMatch(route, /\["viewed","interested","declined","quoted"/);
  assert.match(route, /canManufacturerTransitionMatch\(match\.status,status\)/);
});

test("all assigned match states retain project visibility without querying projects recursively", () => {
  assert.match(
    migration,
    /pm\.status in \('invited', 'viewed', 'interested', 'declined', 'quoted', 'accepted'\)/i,
  );
  const projectPolicy = migration.match(
    /create policy projects_matched_manufacturer_read[\s\S]*?;\s*\n\s*-- The policy/i,
  )?.[0];
  assert.ok(projectPolicy);
  assert.doesNotMatch(projectPolicy, /from public\.projects/i);
});

test("match reads and writes require the authenticated manufacturer owner", () => {
  assert.match(migration, /mp\.owner_id = \(select auth\.uid\(\)\)/i);
  assert.match(migration, /old\.manufacturer_profile_id[\s\S]*mp\.owner_id = acting_user/i);
  assert.doesNotMatch(migration, /(?:using|with check)\s*\(\s*true\s*\)/i);
});

test("quoted is derived only from this manufacturer's submitted quote", () => {
  assert.match(migration, /new\.status = 'quoted'/i);
  assert.match(migration, /q\.project_id = old\.project_id/i);
  assert.match(migration, /q\.manufacturer_profile_id = old\.manufacturer_profile_id/i);
  assert.match(migration, /q\.submitted_by = acting_user/i);
  assert.match(migration, /q\.status = 'submitted'/i);
});

test("only draft and submitted are valid initial manufacturer quote statuses", () => {
  for (const status of ["draft", "submitted"] as const) {
    assert.equal(isManufacturerQuoteInitialStatus(status), true);
  }
  for (const status of ["accepted", "declined", "withdrawn"] as const) {
    assert.equal(isManufacturerQuoteInitialStatus(status), false);
  }
  assert.match(migration, /status in \('draft', 'submitted'\)/i);
  assert.match(migration, /submitted_by = \(select auth\.uid\(\)\)/i);
});
