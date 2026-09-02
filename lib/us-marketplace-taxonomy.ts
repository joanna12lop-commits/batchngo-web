export const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],["DC","District of Columbia"],
] as const;

export const US_REGIONS = ["Northeast","Midwest","South","West","Nationwide"] as const;
export const SUPPLIER_TYPES = [
  "Product Manufacturer",
  "Private-label Manufacturer",
  "Packaging Manufacturer",
  "Contract Manufacturer / Co-packer",
] as const;

export const MARKETPLACE_CATEGORIES = [
  {
    id: "beauty-personal-care",
    slug: "beauty-personal-care",
    name: "Beauty & Personal Care",
    description: "Skincare, body care and private-label beauty products for emerging brands.",
    image: "/images/beauty-skincare.png",
    alt: "Small-batch skincare and personal care products",
    moq: "MOQ 120 pcs",
  },
  {
    id: "candles-home-fragrance",
    slug: "candles-home-fragrance",
    name: "Candles & Home Fragrance",
    description: "Custom candles, wax products and home fragrance collections in flexible production runs.",
    image: "/images/candles.png",
    alt: "Custom candles and home fragrance products",
    moq: "MOQ 100 pcs",
  },
  {
    id: "custom-packaging",
    slug: "custom-packaging",
    name: "Custom Packaging",
    description: "Boxes, pouches, labels and retail-ready packaging tailored to growing brands.",
    image: "/images/packaging.png",
    alt: "Custom boxes, labels and retail packaging",
    moq: "MOQ 250 pcs",
  },
  {
    id: "textile-accessories-pouches",
    slug: "textile-accessories-pouches",
    name: "Textile Accessories & Pouches",
    description: "Scrunchies, cosmetic bags, pouches and small textile accessories produced in manageable runs.",
    image: "/images/bags-pouches.png",
    alt: "Small-batch textile accessories and cosmetic pouches",
    moq: "MOQ 130 pcs",
  },
] as const;

export const PRODUCT_CATEGORIES = MARKETPLACE_CATEGORIES.map((category) => category.name);
export type MarketplaceCategory = typeof MARKETPLACE_CATEGORIES[number];
export type MarketplaceCategorySlug = MarketplaceCategory["slug"];

const LEGACY_CATEGORY_ALIASES: Record<string, MarketplaceCategorySlug> = {
  "Beauty & Skincare": "beauty-personal-care",
  Candles: "candles-home-fragrance",
  Packaging: "custom-packaging",
  "Textile Accessories": "textile-accessories-pouches",
  "Bags & Pouches": "textile-accessories-pouches",
};

export function resolveMarketplaceCategorySlug(value: string | null | undefined): MarketplaceCategorySlug | null {
  if (!value) return null;
  const direct = MARKETPLACE_CATEGORIES.find((category) => category.slug === value || category.name === value);
  return direct?.slug ?? LEGACY_CATEGORY_ALIASES[value] ?? null;
}

export function getMarketplaceCategoryBySlug(value: string | null | undefined) {
  const slug = resolveMarketplaceCategorySlug(value);
  return slug ? MARKETPLACE_CATEGORIES.find((category) => category.slug === slug) : undefined;
}
export const PACKAGING_TYPES = ["Folding cartons","Corrugated boxes","Rigid boxes","Flexible pouches","Labels","Bottles & jars","Cans & tins","Tubes","Mailers","Retail displays"] as const;
export const MATERIALS = ["Paperboard","Corrugated fiberboard","Kraft paper","Glass","Aluminum","Steel","PET","HDPE","LDPE","Polypropylene","Compostable materials","Post-consumer recycled materials"] as const;
export const PRINTING_METHODS = ["Digital printing","Offset printing","Flexographic printing","Screen printing","Pad printing","Direct-to-container printing","Label printing"] as const;
export const FINISHING_CAPABILITIES = ["Foil stamping","Embossing","Debossing","Spot UV","Matte coating","Gloss coating","Soft-touch coating","Die cutting","Window patching"] as const;
export const FILLING_CAPABILITIES = ["Dry goods","Powders","Liquids","Oils","Creams & lotions","Gels","Capsules & tablets","Food products","Beverages"] as const;
export const INDUSTRIES_SERVED = ["Food & Beverage","Beauty & Personal Care","Supplements","Household Products","Pet Care","Apparel","Retail","E-commerce"] as const;

export type USRegion = typeof US_REGIONS[number];
export type SupplierType = typeof SUPPLIER_TYPES[number];

export function resolveSupplierType(value: string): SupplierType | null {
  if ((SUPPLIER_TYPES as readonly string[]).includes(value)) return value as SupplierType;
  if (value === "Contract Packager / Co-packer") return "Contract Manufacturer / Co-packer";
  return null;
}

export function formatUSAddress(city:string,state:string,zipCode:string,country="United States"){
  return [city,[state,zipCode].filter(Boolean).join(" "),country].filter(Boolean).join(", ");
}
