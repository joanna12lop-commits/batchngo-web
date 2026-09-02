import type { ProjectStep2 } from "./project-draft.ts";
import type { MarketplaceCategorySlug } from "./us-marketplace-taxonomy.ts";

export type SpecificationConfig = {
  productLabel: string; productOptions: readonly string[];
  primaryLabel: string; primaryOptions: readonly string[];
  secondaryLabel?: string; secondaryOptions?: readonly string[];
  textLabel?: string; sizeLabel?: string; sizeUnits?: readonly string[];
  dimensions?: boolean; dimensionUnits?: readonly string[];
  customizationLabel?: string; customizationOptions?: readonly string[];
  requirementsLabel?: string; requirementsOptions?: readonly string[];
  printingOptions?: readonly string[];
};

const guidance = "Not sure — need maker guidance";
export const PROJECT_SPECIFICATIONS: Record<MarketplaceCategorySlug, SpecificationConfig> = {
  "beauty-personal-care": {
    productLabel: "Product type", productOptions: ["Face serum","Face cream","Body care","Lip care","Cleanser","Hair care","Other",guidance],
    primaryLabel: "Formula approach", primaryOptions: ["Ready-made private-label formula","Customized existing formula","Fully custom formula",guidance],
    textLabel: "Product format or texture", sizeLabel: "Target fill size", sizeUnits: ["ml","fl oz","g"],
    secondaryLabel: "Packaging format", secondaryOptions: ["Bottle","Jar","Tube","Pump bottle","Dropper bottle","Maker recommendation"],
    customizationLabel: "Customization", customizationOptions: ["Custom formula","Custom fragrance","Custom color","Custom label","Custom primary packaging","Custom retail box","Private label"],
    requirementsLabel: "Desired claims or requirements", requirementsOptions: ["Vegan","Cruelty-free","Fragrance-free","Organic ingredients","Sensitive skin","Other","Not sure"],
  },
  "candles-home-fragrance": {
    productLabel: "Product type", productOptions: ["Container candle","Pillar candle","Wax melts","Reed diffuser","Room spray","Other",guidance],
    primaryLabel: "Wax or product base", primaryOptions: ["Soy wax","Coconut wax","Beeswax","Paraffin","Wax blend","Not applicable","Maker recommendation"],
    secondaryLabel: "Vessel or container", secondaryOptions: ["Glass","Tin","Ceramic","Custom vessel","No vessel","Maker recommendation"],
    sizeLabel: "Target size or fill weight", sizeUnits: ["g","oz","ml"], textLabel: "Fragrance requirements",
    customizationLabel: "Customization", customizationOptions: ["Custom fragrance","Custom vessel color","Custom label","Custom box","Custom lid","Private label"],
    requirementsLabel: "Additional requirements", requirementsOptions: ["Vegan","Cruelty-free","Phthalate-free fragrance","Natural wax preference","Other","Not sure"],
  },
  "custom-packaging": {
    productLabel: "Packaging type", productOptions: ["Folding carton","Rigid box","Corrugated shipping box","Mailer box","Stand-up pouch","Product label","Sleeve","Insert","Other",guidance],
    primaryLabel: "Material", primaryOptions: ["Paperboard","Corrugated fiberboard","Kraft paper","Recycled paper","Flexible film","Compostable material","Maker recommendation"],
    dimensions: true, dimensionUnits: ["mm","cm","inches"],
    printingOptions: ["Digital printing","Offset printing","Foil stamping","Embossing or debossing","Spot UV","Matte finish","Gloss finish","No printing","Maker recommendation"],
    requirementsLabel: "Sustainability or compliance", requirementsOptions: ["FSC materials","Recycled content","Recyclable","Compostable","Food-safe","Other","Not sure"],
  },
  "textile-accessories-pouches": {
    productLabel: "Product type", productOptions: ["Scrunchie","Cosmetic pouch","Drawstring bag","Zipper pouch","Tote bag","Small textile accessory","Other",guidance],
    primaryLabel: "Main material", primaryOptions: ["Cotton","Organic cotton","Linen","Satin","Polyester","Recycled fabric","Velvet","Maker recommendation"],
    dimensions: true, dimensionUnits: ["cm","inches"], textLabel: "Construction details",
    customizationLabel: "Customization", customizationOptions: ["Custom fabric color","Printed pattern","Embroidery","Woven label","Printed logo","Custom zipper or hardware","Individual packaging","Maker recommendation"],
    requirementsLabel: "Material requirements", requirementsOptions: ["Organic material","Recycled material","Vegan materials","OEKO-TEX preference","Other","Not sure"],
  },
};

export function isMakerGuidance(value: string) { return value.includes("Not sure") || value === "Maker recommendation"; }
export function validateProjectSpecifications(step: ProjectStep2) {
  return { productType: step.productType ? "" : "Select a product type.", primaryDecision: step.primaryDecision ? "" : "Select one option or request maker guidance." };
}
export function getTechnicalReviewItems(step: ProjectStep2, config: SpecificationConfig): Array<[string, string]> {
  const dimensions = [step.dimensions.length, step.dimensions.width, step.dimensions.height].filter(Boolean).join(" × ");
  const pairs: Array<[string, string]> = [[config.productLabel,step.productType],[config.primaryLabel,step.primaryDecision]];
  if (config.secondaryLabel) pairs.push([config.secondaryLabel,step.secondaryDecision]);
  if (config.textLabel) pairs.push([config.textLabel,step.textDetail]);
  if (config.sizeLabel) pairs.push([config.sizeLabel,step.size.value ? `${step.size.value} ${step.size.unit}` : ""]);
  if (config.dimensions) pairs.push(["Dimensions",dimensions ? `${dimensions} ${step.dimensions.unit}` : ""]);
  if (config.printingOptions) pairs.push(["Printing and finishing",step.printingFinishing.join(", ")]);
  if (config.customizationLabel) pairs.push([config.customizationLabel,step.customizationOptions.join(", ")]);
  if (config.requirementsLabel) pairs.push([config.requirementsLabel,step.complianceRequirements.join(", ")]);
  pairs.push(["Additional technical notes",step.additionalNotes]);
  if ([step.productType,step.primaryDecision,step.secondaryDecision,...step.printingFinishing,...step.customizationOptions].some(isMakerGuidance)) pairs.push(["Maker guidance","Maker guidance requested"]);
  return pairs.filter(([,value]) => Boolean(value));
}
