import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { extname, join } from "node:path";
import test from "node:test";
import { allManufacturers, getNavigationHref, manufacturerMatchesCategorySlug, manufacturers } from "../lib/marketplace-data.ts";
import { MARKETPLACE_CATEGORIES, resolveMarketplaceCategorySlug, SUPPLIER_TYPES } from "../lib/us-marketplace-taxonomy.ts";
import { PROJECT_SPECIFICATIONS, getTechnicalReviewItems, isMakerGuidance, validateProjectSpecifications } from "../lib/project-specifications.ts";
import { PROJECT_DRAFT_STORAGE_KEY, changeProjectDraftCategory, createEmptyProjectDraft, readProjectDraft } from "../lib/project-draft.ts";

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

test("each launch category has an isolated technical specification", () => {
  assert.deepEqual(Object.keys(PROJECT_SPECIFICATIONS).sort(), MARKETPLACE_CATEGORIES.map((category)=>category.slug).sort());
  assert.equal(PROJECT_SPECIFICATIONS["beauty-personal-care"].primaryOptions.includes("Corrugated fiberboard"), false);
  assert.equal(PROJECT_SPECIFICATIONS["candles-home-fragrance"].customizationOptions?.includes("Embroidery"), false);
  assert.equal(PROJECT_SPECIFICATIONS["custom-packaging"].primaryOptions.includes("Steel"), false);
  assert.equal(PROJECT_SPECIFICATIONS["textile-accessories-pouches"].primaryOptions.includes("Soy wax"), false);
});

test("maker guidance satisfies the required technical decisions", () => {
  assert.equal(isMakerGuidance("Not sure — need maker guidance"), true);
  assert.equal(isMakerGuidance("Maker recommendation"), true);
  assert.deepEqual(validateProjectSpecifications({...createEmptyProjectDraft().step2,productType:"Not sure — need maker guidance",primaryDecision:"Maker recommendation"}), { productType: "", primaryDecision: "" });
  assert.notEqual(validateProjectSpecifications(createEmptyProjectDraft().step2).productType, "");
});

test("technical review uses category labels and omits unrelated empty fields", () => {
  const step2={...createEmptyProjectDraft().step2,categorySlug:"custom-packaging",productType:"Mailer box",primaryDecision:"Maker recommendation"};
  const items=getTechnicalReviewItems(step2,PROJECT_SPECIFICATIONS["custom-packaging"]);
  assert.deepEqual(items.slice(0,2),[["Packaging type","Mailer box"],["Material","Maker recommendation"]]);
  assert.equal(items.some(([label])=>label==="Fragrance requirements"),false);
  assert.equal(items.some(([,value])=>value==="Maker guidance requested"),true);
});

test("changing category clears only technical details", () => {
  const draft=createEmptyProjectDraft(); draft.step1={...draft.step1,selectedCategory:"beauty-personal-care",projectTitle:"Serum",description:"Test"}; draft.step2={...draft.step2,categorySlug:"beauty-personal-care",productType:"Face serum",primaryDecision:"Fully custom formula"}; draft.step3.orderQuantity="500"; draft.step4.shippingState="NY";
  const changed=changeProjectDraftCategory(draft,"custom-packaging");
  assert.equal(changed.step1.projectTitle,"Serum"); assert.equal(changed.step3.orderQuantity,"500"); assert.equal(changed.step4.shippingState,"NY"); assert.equal(changed.step2.productType,""); assert.equal(changed.step2.categorySlug,"custom-packaging");
});

test("legacy technical data is safe across repeated draft reads", () => {
  const values=new Map<string,string>();
  const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)};
  const previous=Object.getOwnPropertyDescriptor(globalThis,"window");
  Object.defineProperty(globalThis,"window",{configurable:true,value:{localStorage:storage,sessionStorage:storage}});
  try {
    const legacy=createEmptyProjectDraft() as unknown as Record<string,unknown>;
    legacy.schemaVersion=4;
    const legacyStep2={...(legacy.step2 as Record<string,unknown>),categorySlug:undefined,materials:["Steel"],customizationOptions:["Engraving"],colorRequirements:"Pantone 123"};
    legacy.step2=legacyStep2;
    storage.setItem(PROJECT_DRAFT_STORAGE_KEY,JSON.stringify(legacy));
    const first=readProjectDraft(); const refreshed=readProjectDraft();
    assert.equal(first?.step2.primaryDecision,"");
    assert.match(first?.step2.additionalNotes??"",/Previous materials: Steel/);
    assert.deepEqual(refreshed?.step2,first?.step2);
  } finally {
    if(previous)Object.defineProperty(globalThis,"window",previous); else Reflect.deleteProperty(globalThis,"window");
  }
});

test("post-project layouts constrain wide content to local responsive containers", () => {
  const files = [
    "app/post-project/page.tsx",
    "app/post-project/details/page.tsx",
    "app/post-project/quantity-budget/page.tsx",
    "app/post-project/review/page.tsx",
  ];
  for (const path of files) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.match(source, /max-w-full overflow-x-auto/);
    assert.match(source, /min-w-\[(?:850|900)px\]/);
  }
  const timeline = readFileSync(new URL("../app/post-project/timeline/page.tsx", import.meta.url), "utf8");
  assert.match(timeline, /w-full min-w-0 max-w-5xl/);
  assert.match(timeline, /block w-full min-w-0 max-w-full/);
  assert.doesNotMatch(timeline, /overflow-x-hidden/);
});

test("user-facing source text does not contain common encoding artifacts", () => {
  const projectRoot = fileURLToPath(new URL("..", import.meta.url));
  const sourceExtensions = new Set([".ts", ".tsx", ".css", ".md"]);
  const artifacts = /[ÂÃâ�]/u;
  const scan = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) scan(path);
      else if (sourceExtensions.has(extname(entry.name))) {
        assert.doesNotMatch(readFileSync(path, "utf8"), artifacts, `Encoding artifact found in ${path}`);
      }
    }
  };
  for (const directory of ["app", "components", "lib"]) scan(join(projectRoot, directory));
});
