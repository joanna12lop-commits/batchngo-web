import assert from "node:assert/strict";
import test from "node:test";
import { authorizeAdminRole } from "../lib/admin/authorization.ts";
import { canReadQuote } from "../lib/quotes/authorization.ts";

test("anonymous requests cannot open the admin panel or call admin endpoints", () => {
  assert.deepEqual(authorizeAdminRole(null, false), { allowed: false, status: 401, error: "Unauthorized" });
});

test("customer requests are forbidden", () => {
  assert.deepEqual(authorizeAdminRole("customer", true), { allowed: false, status: 403, error: "Forbidden" });
});

test("manufacturer requests are forbidden", () => {
  assert.deepEqual(authorizeAdminRole("manufacturer", true), { allowed: false, status: 403, error: "Forbidden" });
});

test("only an authenticated admin is allowed", () => {
  assert.deepEqual(authorizeAdminRole("admin", true), { allowed: true });
});

test("a customer cannot read a quote for another customer's project",()=>{assert.equal(canReadQuote("customer","customer-b",{projectCustomerId:"customer-a",manufacturerOwnerId:"maker-a"}),false);});
test("a manufacturer cannot read another manufacturer's quote",()=>{assert.equal(canReadQuote("manufacturer","maker-b",{projectCustomerId:"customer-a",manufacturerOwnerId:"maker-a"}),false);});
test("the project customer, quote manufacturer, and admin can read the appropriate quote",()=>{const quote={projectCustomerId:"customer-a",manufacturerOwnerId:"maker-a"};assert.equal(canReadQuote("customer","customer-a",quote),true);assert.equal(canReadQuote("manufacturer","maker-a",quote),true);assert.equal(canReadQuote("admin","admin-a",quote),true);});
