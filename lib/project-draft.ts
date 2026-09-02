export const PROJECT_DRAFT_STORAGE_KEY = "batchngo-project-draft";
export const PROJECT_DRAFT_SESSION_KEY = "batchngo-project-draft-session";
import { resolveMarketplaceCategorySlug } from "./us-marketplace-taxonomy";

export const PROJECT_DRAFT_SCHEMA_VERSION = 4;

export type ProjectStep1 = {
  selectedCategory: string;
  projectTitle: string;
  description: string;
  referenceImages: Array<{ name: string; isPdf: boolean }>;
};

export type ProjectStep2 = {
  productType: string;
  materials: string[];
  dimensions: { length: string; width: string; height: string; unit: string };
  colorRequirements: string;
  customizationOptions: string[];
  packagingRequirements: string;
  complianceRequirements: string[];
  additionalNotes: string;
};

export type ProjectStep3 = {
  orderQuantity: string;
  quantityFlexibility: string;
  minimumBudget: string;
  maximumBudget: string;
  currency: string;
  budgetType: string;
  sampleBudget: string;
  pricePriorities: string[];
  additionalBudgetNotes: string;
};

export type ProjectStep4 = {
  targetDeliveryDate: string;
  timelineFlexibility: string;
  sampleDeadline: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  urgency: string;
  additionalTimelineNotes: string;
};

export type ProjectDraft = {
  schemaVersion: number;
  draftId: string;
  categoryMigrationRequired: boolean;
  step1: ProjectStep1;
  step2: ProjectStep2;
  step3: ProjectStep3;
  step4: ProjectStep4;
  updatedAt: string | null;
};

export function createEmptyProjectDraft(): ProjectDraft {
  const emptyDraft: ProjectDraft = {
    schemaVersion: PROJECT_DRAFT_SCHEMA_VERSION,
    draftId: createDraftId(),
    categoryMigrationRequired: false,
    step1: {
      selectedCategory: "",
      projectTitle: "",
      description: "",
      referenceImages: [],
    },
    step2: {
      productType: "",
      materials: [],
      dimensions: { length: "", width: "", height: "", unit: "cm" },
      colorRequirements: "",
      customizationOptions: [],
      packagingRequirements: "",
      complianceRequirements: [],
      additionalNotes: "",
    },
    step3: {
      orderQuantity: "",
      quantityFlexibility: "",
      minimumBudget: "",
      maximumBudget: "",
      currency: "USD",
      budgetType: "",
      sampleBudget: "",
      pricePriorities: [],
      additionalBudgetNotes: "",
    },
    step4: {
      targetDeliveryDate: "",
      timelineFlexibility: "",
      sampleDeadline: "",
      shippingCity: "",
      shippingState: "",
      shippingZipCode: "",
      shippingCountry: "United States",
      urgency: "",
      additionalTimelineNotes: "",
    },
    updatedAt: null,
  };

  return emptyDraft;
}

export function hasMeaningfulProjectDraft(draft: ProjectDraft | null): boolean {
  if (!draft) return false;
  const { step1, step2, step3, step4 } = draft;
  return Boolean(
    step1.selectedCategory ||
      step1.projectTitle.trim() ||
      step1.description.trim() ||
      step1.referenceImages.length ||
      step2.productType.trim() ||
      step2.materials.length ||
      step2.dimensions.length ||
      step2.dimensions.width ||
      step2.dimensions.height ||
      step2.colorRequirements.trim() ||
      step2.customizationOptions.length ||
      step2.packagingRequirements.trim() ||
      step2.complianceRequirements.length ||
      step2.additionalNotes.trim() ||
      step3.orderQuantity ||
      step3.quantityFlexibility ||
      step3.minimumBudget ||
      step3.maximumBudget ||
      step3.currency ||
      step3.budgetType ||
      step3.sampleBudget ||
      step3.pricePriorities.length ||
      step3.additionalBudgetNotes.trim() ||
      step4.targetDeliveryDate ||
      step4.timelineFlexibility ||
      step4.sampleDeadline ||
      step4.shippingCity.trim() || step4.shippingState || step4.shippingZipCode.trim() ||
      step4.urgency ||
      step4.additionalTimelineNotes.trim(),
  );
}

export function readProjectDraft(): ProjectDraft | null {
  const raw = window.localStorage.getItem(PROJECT_DRAFT_STORAGE_KEY) ?? window.sessionStorage.getItem(PROJECT_DRAFT_SESSION_KEY);
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) throw new Error("Invalid project draft");
      if (![2, 3, PROJECT_DRAFT_SCHEMA_VERSION].includes(parsed.schemaVersion as number)) {
        throw new Error("Unsupported project draft version");
      }
      const empty = createEmptyProjectDraft();
      const originalStep1 = isRecord(parsed.step1) ? parsed.step1 : {};
      const originalCategory = stringValue(originalStep1.selectedCategory);
      return {
        schemaVersion: PROJECT_DRAFT_SCHEMA_VERSION,
        draftId: typeof parsed.draftId === "string" && parsed.draftId ? parsed.draftId : createDraftId(),
        categoryMigrationRequired: Boolean(originalCategory && !resolveMarketplaceCategorySlug(originalCategory)),
        step1: normalizeStep1(parsed.step1, empty.step1),
        step2: {
          ...normalizeStep2(parsed.step2, empty.step2),
        },
        step3: normalizeStep3(parsed.step3, empty.step3),
        step4: normalizeStep4(parsed.step4, empty.step4),
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
      };
    } catch {
      window.localStorage.removeItem(PROJECT_DRAFT_STORAGE_KEY);
      return null;
    }
  }

  return null;
}

function createDraftId() {
  return globalThis.crypto?.randomUUID?.() ?? `project-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const stringValue = (value: unknown) => (typeof value === "string" ? value : "");
const stringArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

function fileMetadata(value: unknown): Array<{ name: string; isPdf: boolean }> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => isRecord(item) && typeof item.name === "string"
    ? [{ name: item.name, isPdf: item.isPdf === true }]
    : []);
}

function normalizeStep1(value: unknown, empty: ProjectStep1): ProjectStep1 {
  if (!isRecord(value)) return empty;
  return { selectedCategory: resolveMarketplaceCategorySlug(stringValue(value.selectedCategory)) ?? "", projectTitle: stringValue(value.projectTitle), description: stringValue(value.description), referenceImages: fileMetadata(value.referenceImages) };
}

function normalizeStep2(value: unknown, empty: ProjectStep2): ProjectStep2 {
  if (!isRecord(value)) return empty;
  const dimensions = isRecord(value.dimensions) ? value.dimensions : {};
  const unit = stringValue(dimensions.unit);
  return {
    productType: stringValue(value.productType), materials: stringArray(value.materials),
    dimensions: { length: stringValue(dimensions.length), width: stringValue(dimensions.width), height: stringValue(dimensions.height), unit: ["mm", "cm", "inches"].includes(unit) ? unit : empty.dimensions.unit },
    colorRequirements: stringValue(value.colorRequirements), customizationOptions: stringArray(value.customizationOptions),
    packagingRequirements: stringValue(value.packagingRequirements), complianceRequirements: stringArray(value.complianceRequirements), additionalNotes: stringValue(value.additionalNotes),
  };
}

function normalizeStep3(value: unknown, empty: ProjectStep3): ProjectStep3 {
  if (!isRecord(value)) return empty;
  return { ...empty, orderQuantity: stringValue(value.orderQuantity), quantityFlexibility: stringValue(value.quantityFlexibility), minimumBudget: stringValue(value.minimumBudget), maximumBudget: stringValue(value.maximumBudget), currency: "USD", budgetType: stringValue(value.budgetType), sampleBudget: stringValue(value.sampleBudget), pricePriorities: stringArray(value.pricePriorities), additionalBudgetNotes: stringValue(value.additionalBudgetNotes) };
}

function normalizeStep4(value: unknown, empty: ProjectStep4): ProjectStep4 {
  if (!isRecord(value)) return empty;
  return { ...empty, targetDeliveryDate: stringValue(value.targetDeliveryDate), timelineFlexibility: stringValue(value.timelineFlexibility), sampleDeadline: stringValue(value.sampleDeadline), shippingCity: stringValue(value.shippingCity), shippingState: stringValue(value.shippingState), shippingZipCode: stringValue(value.shippingZipCode), shippingCountry: "United States", urgency: stringValue(value.urgency), additionalTimelineNotes: stringValue(value.additionalTimelineNotes) };
}

export function writeProjectDraft(update: Partial<ProjectDraft>): ProjectDraft {
  const current = readProjectDraft();
  const next: ProjectDraft = {
    ...createEmptyProjectDraft(),
    ...current,
    ...update,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(PROJECT_DRAFT_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("batchngo:draft-changed", { detail: { kind: "project" } }));
  return next;
}
