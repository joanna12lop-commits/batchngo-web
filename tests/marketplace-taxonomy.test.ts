import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { allManufacturers, getNavigationHref, manufacturerMatchesCategorySlug, manufacturers } from "../lib/marketplace-data.ts";
import { MARKETPLACE_CATEGORIES, resolveMarketplaceCategorySlug, SUPPLIER_TYPES } from "../lib/us-marketplace-taxonomy.ts";

test("the launch taxonomy contains exactly four canonical categories", () => {
  assert.deepEqual(MARKETPLACE_CATEGORIES.map(({ name, slug }) => ({ name, slug })), [
    { name: "Beauty & Personal Care", slug: "beauty-personal-care" },
    { name: "Candles & Home Fragrance", slug: "candles-home-fragrance" },
    { name: "Custom Packaging", slug: "custom-packaging" },
    { name: "Textile Accessories & Pouches", slug: "textile-accessories-pouches" },
  ]);
  assert.equal(new Set(MARKETPLACE_CATEGORIES.map((category) => category.slug)).size, 4);
});

test("URL category values resolve safely and filter the published profiles", () => {
  assert.equal(resolveMarketplaceCategorySlug("candles-home-fragrance"), "candles-home-fragrance");
  assert.equal(resolveMarketplaceCategorySlug("not-a-category"), null);
  assert.deepEqual(
    manufacturers.filter((maker) => manufacturerMatchesCategorySlug(maker, "candles-home-fragrance")).map((maker) => maker.slug),
    ["atelier-lumen"],
  );
  assert.equal(manufacturers.every((maker) => manufacturerMatchesCategorySlug(maker, "not-a-category")), true);
});

test("unpublished manufacturers remain in source data but not in public collections", () => {
  assert.equal(allManufacturers.find((maker) => maker.slug === "harbor-works")?.isPublished, false);
  assert.equal(manufacturers.some((maker) => maker.slug === "harbor-works"), false);
});

test("supplier types use the shared launch taxonomy", () => {
  assert.deepEqual(SUPPLIER_TYPES, [
    "Product Manufacturer",
    "Private-label Manufacturer",
    "Packaging Manufacturer",
    "Contract Manufacturer / Co-packer",
  ]);
  assert.equal(manufacturers.every((maker) => SUPPLIER_TYPES.includes(maker.supplierType)), true);
});

test("Find Makers navigation always opens the clean finder route", () => {
  assert.equal(getNavigationHref("Find Makers"), "/find-makers");
  assert.equal(getNavigationHref("Find Makers").includes("#featured-makers"), false);
});

test("project and manufacturer application entry pages use the shared full header", () => {
  for (const path of ["app/post-project/page.tsx", "app/for-manufacturers/apply/page.tsx"]) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.match(source, /<Header\s*\/>/);
    assert.doesNotMatch(source, /<Header\s+compact/);
  }
});
