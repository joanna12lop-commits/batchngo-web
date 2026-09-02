export const MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY =
  "batchngo-manufacturer-application-draft";
import { getMarketplaceCategoryBySlug, resolveMarketplaceCategorySlug, resolveSupplierType } from "./us-marketplace-taxonomy.ts";
export const MANUFACTURER_APPLICATION_DRAFT_SESSION_KEY = "batchngo-manufacturer-application-draft-session";
export const MANUFACTURER_DRAFT_SCHEMA_VERSION = 4;

export type ManufacturerApplicationStep1 = {
  businessName: string; contactPerson: string; businessEmail: string;
  businessCity: string; businessState: string; businessZipCode: string; businessCountry: string;
  website: string; supplierTypes: string[]; selectedCategories: string[];
  usBasedCompany: boolean; usManufacturing: boolean; originClaim: string;
  minimumOrderQuantity: string; typicalLeadTime: string; capabilitiesDescription: string;
  portfolioImages: Array<{ name: string; isPdf: boolean }>;
};
export type ManufacturerApplicationStep2 = {
  supportedCategories: string[]; packagingTypes: string[]; productTypes: string; materials: string[];
  printingMethods: string[]; finishingCapabilities: string[]; fillingCapabilities: string[];
  manufacturingProcesses: string[]; customizationOptions: string[]; industriesServed: string[];
  assemblyAndKitting: boolean; prototypeAvailable: boolean;
  privateLabelSupport: boolean; packagingSupport: boolean; designSupport: boolean;
  certifications: string[]; additionalCapabilityNotes: string;
};
export type ManufacturerApplicationStep3 = {
  minimumOrderQuantity: string; maximumOrderCapacity: string; monthlyCapacity: string;
  typicalLeadTime: string; sampleLeadTime: string; sampleAvailable: string;
  shippingRegions: string[]; shippingStates: string[]; countriesServed: string;
  facilityCity: string; facilityState: string; facilityZipCode: string; facilityCountry: string;
  teamSize: string; yearsInBusiness: string; preferredProjectSizes: string[]; operationalNotes: string;
};
export type ManufacturerApplicationStep4 = {
  legalBusinessName: string; registrationNumber: string; taxNumber: string;
  businessAddress: string; contactPhone: string; certifications: string[];
  insuranceConfirmed: boolean; termsConfirmed: boolean;
  documents: Array<{ name: string; isPdf: boolean }>;
};
export type ManufacturerApplicationDraft = {
  schemaVersion: number;
  draftId: string;
  step1: ManufacturerApplicationStep1; step2: ManufacturerApplicationStep2;
  step3: ManufacturerApplicationStep3; step4: ManufacturerApplicationStep4;
  updatedAt: string | null;
};

export function createEmptyManufacturerApplicationDraft(): ManufacturerApplicationDraft {
  return {
    schemaVersion: MANUFACTURER_DRAFT_SCHEMA_VERSION,
    draftId: createDraftId(),
    step1: { businessName: "", contactPerson: "", businessEmail: "", businessCity: "", businessState: "", businessZipCode: "", businessCountry: "United States", website: "", supplierTypes: [], selectedCategories: [], usBasedCompany: false, usManufacturing: false, originClaim: "", minimumOrderQuantity: "", typicalLeadTime: "", capabilitiesDescription: "", portfolioImages: [] },
    step2: { supportedCategories: [], packagingTypes: [], productTypes: "", materials: [], printingMethods: [], finishingCapabilities: [], fillingCapabilities: [], manufacturingProcesses: [], customizationOptions: [], industriesServed: [], assemblyAndKitting: false, prototypeAvailable: false, privateLabelSupport: false, packagingSupport: false, designSupport: false, certifications: [], additionalCapabilityNotes: "" },
    step3: { minimumOrderQuantity: "", maximumOrderCapacity: "", monthlyCapacity: "", typicalLeadTime: "", sampleLeadTime: "", sampleAvailable: "", shippingRegions: [], shippingStates: [], countriesServed: "United States", facilityCity: "", facilityState: "", facilityZipCode: "", facilityCountry: "United States", teamSize: "", yearsInBusiness: "", preferredProjectSizes: [], operationalNotes: "" },
    step4: { legalBusinessName: "", registrationNumber: "", taxNumber: "", businessAddress: "", contactPhone: "", certifications: [], insuranceConfirmed: false, termsConfirmed: false, documents: [] },
    updatedAt: null,
  };
}

export function hasMeaningfulManufacturerApplicationDraft(draft: ManufacturerApplicationDraft | null): boolean {
  if (!draft) return false;
  const { draftId: _draftId, ...draftData } = draft;
  const { draftId: _emptyDraftId, ...emptyData } = createEmptyManufacturerApplicationDraft();
  void _draftId; void _emptyDraftId;
  const serialized = JSON.stringify({ ...draftData, updatedAt: null });
  const empty = JSON.stringify(emptyData);
  return serialized !== empty;
}

export function readManufacturerApplicationDraft(): ManufacturerApplicationDraft | null {
  const raw = window.localStorage.getItem(MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY) ?? window.sessionStorage.getItem(MANUFACTURER_APPLICATION_DRAFT_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) throw new Error("Invalid manufacturer draft");
    if (![2, 3, MANUFACTURER_DRAFT_SCHEMA_VERSION].includes(parsed.schemaVersion as number)) throw new Error("Unsupported manufacturer draft version");
    const empty = createEmptyManufacturerApplicationDraft();
    return {
      schemaVersion: MANUFACTURER_DRAFT_SCHEMA_VERSION,
      draftId: typeof parsed.draftId === "string" && parsed.draftId ? parsed.draftId : createDraftId(),
      step1: normalizeStep1(parsed.step1, empty.step1), step2: normalizeStep2(parsed.step2, empty.step2),
      step3: normalizeStep3(parsed.step3, empty.step3), step4: normalizeStep4(parsed.step4, empty.step4),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch { window.localStorage.removeItem(MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY); return null; }
}

function createDraftId() { return globalThis.crypto?.randomUUID?.() ?? `manufacturer-${Date.now()}-${Math.random().toString(36).slice(2)}`; }

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
const text = (value: unknown) => typeof value === "string" ? value : "";
const texts = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const categories = (value: unknown) => texts(value).flatMap((item) => {
  const category = getMarketplaceCategoryBySlug(resolveMarketplaceCategorySlug(item));
  return category ? [category.name] : [];
});
const supplierTypes = (value: unknown) => texts(value).flatMap((item) => {
  const supplierType = resolveSupplierType(item);
  return supplierType ? [supplierType] : [];
});
const bool = (value: unknown) => value === true;
const files = (value: unknown) => Array.isArray(value) ? value.flatMap((item) => isRecord(item) && typeof item.name === "string" ? [{ name: item.name, isPdf: item.isPdf === true }] : []) : [];

function normalizeStep1(value: unknown, empty: ManufacturerApplicationStep1): ManufacturerApplicationStep1 { if (!isRecord(value)) return empty; return { ...empty, businessName:text(value.businessName), contactPerson:text(value.contactPerson), businessEmail:text(value.businessEmail), businessCity:text(value.businessCity), businessState:text(value.businessState), businessZipCode:text(value.businessZipCode), businessCountry:"United States", website:text(value.website), supplierTypes:supplierTypes(value.supplierTypes), selectedCategories:categories(value.selectedCategories), usBasedCompany:bool(value.usBasedCompany), usManufacturing:bool(value.usManufacturing), originClaim:text(value.originClaim), minimumOrderQuantity:text(value.minimumOrderQuantity), typicalLeadTime:text(value.typicalLeadTime), capabilitiesDescription:text(value.capabilitiesDescription), portfolioImages:files(value.portfolioImages) }; }
function normalizeStep2(value: unknown, empty: ManufacturerApplicationStep2): ManufacturerApplicationStep2 { if (!isRecord(value)) return empty; return { ...empty, supportedCategories:categories(value.supportedCategories), packagingTypes:texts(value.packagingTypes), productTypes:text(value.productTypes), materials:texts(value.materials), printingMethods:texts(value.printingMethods), finishingCapabilities:texts(value.finishingCapabilities), fillingCapabilities:texts(value.fillingCapabilities), manufacturingProcesses:texts(value.manufacturingProcesses), customizationOptions:texts(value.customizationOptions), industriesServed:texts(value.industriesServed), assemblyAndKitting:bool(value.assemblyAndKitting), prototypeAvailable:bool(value.prototypeAvailable), privateLabelSupport:bool(value.privateLabelSupport), packagingSupport:bool(value.packagingSupport), designSupport:bool(value.designSupport), certifications:texts(value.certifications), additionalCapabilityNotes:text(value.additionalCapabilityNotes) }; }
function normalizeStep3(value: unknown, empty: ManufacturerApplicationStep3): ManufacturerApplicationStep3 { if (!isRecord(value)) return empty; return { ...empty, minimumOrderQuantity:text(value.minimumOrderQuantity), maximumOrderCapacity:text(value.maximumOrderCapacity), monthlyCapacity:text(value.monthlyCapacity), typicalLeadTime:text(value.typicalLeadTime), sampleLeadTime:text(value.sampleLeadTime), sampleAvailable:text(value.sampleAvailable), shippingRegions:texts(value.shippingRegions), shippingStates:texts(value.shippingStates), countriesServed:"United States", facilityCity:text(value.facilityCity), facilityState:text(value.facilityState), facilityZipCode:text(value.facilityZipCode), facilityCountry:"United States", teamSize:text(value.teamSize), yearsInBusiness:text(value.yearsInBusiness), preferredProjectSizes:texts(value.preferredProjectSizes), operationalNotes:text(value.operationalNotes) }; }
function normalizeStep4(value: unknown, empty: ManufacturerApplicationStep4): ManufacturerApplicationStep4 { if (!isRecord(value)) return empty; return { legalBusinessName:text(value.legalBusinessName), registrationNumber:text(value.registrationNumber), taxNumber:text(value.taxNumber), businessAddress:text(value.businessAddress), contactPhone:text(value.contactPhone), certifications:texts(value.certifications), insuranceConfirmed:bool(value.insuranceConfirmed), termsConfirmed:bool(value.termsConfirmed), documents:files(value.documents) }; }

export function writeManufacturerApplicationDraft(update: Partial<ManufacturerApplicationDraft>): ManufacturerApplicationDraft {
  const next = { ...createEmptyManufacturerApplicationDraft(), ...readManufacturerApplicationDraft(), ...update, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("batchngo:draft-changed", { detail: { kind: "manufacturer" } }));
  return next;
}

export function clearManufacturerApplicationDraft(): ManufacturerApplicationDraft {
  window.localStorage.removeItem(MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY);
  window.sessionStorage.removeItem(MANUFACTURER_APPLICATION_DRAFT_SESSION_KEY);
  window.dispatchEvent(new CustomEvent("batchngo:draft-changed", { detail: { kind: "manufacturer" } }));
  return createEmptyManufacturerApplicationDraft();
}
