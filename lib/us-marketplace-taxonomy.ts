export const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],["DC","District of Columbia"],
] as const;

export const US_REGIONS = ["Northeast","Midwest","South","West","Nationwide"] as const;
export const SUPPLIER_TYPES = ["Packaging Manufacturer","Packaging Supplier","Contract Packager / Co-packer"] as const;
export const PRODUCT_CATEGORIES = ["Food & Beverage","Beauty & Personal Care","Health & Wellness","Home & Household","Pet Products","Apparel & Soft Goods","Retail & E-commerce","Other"] as const;
export const PACKAGING_TYPES = ["Folding cartons","Corrugated boxes","Rigid boxes","Flexible pouches","Labels","Bottles & jars","Cans & tins","Tubes","Mailers","Retail displays"] as const;
export const MATERIALS = ["Paperboard","Corrugated fiberboard","Kraft paper","Glass","Aluminum","Steel","PET","HDPE","LDPE","Polypropylene","Compostable materials","Post-consumer recycled materials"] as const;
export const PRINTING_METHODS = ["Digital printing","Offset printing","Flexographic printing","Screen printing","Pad printing","Direct-to-container printing","Label printing"] as const;
export const FINISHING_CAPABILITIES = ["Foil stamping","Embossing","Debossing","Spot UV","Matte coating","Gloss coating","Soft-touch coating","Die cutting","Window patching"] as const;
export const FILLING_CAPABILITIES = ["Dry goods","Powders","Liquids","Oils","Creams & lotions","Gels","Capsules & tablets","Food products","Beverages"] as const;
export const INDUSTRIES_SERVED = ["Food & Beverage","Beauty & Personal Care","Supplements","Household Products","Pet Care","Apparel","Retail","E-commerce"] as const;

export type USRegion = typeof US_REGIONS[number];
export type SupplierType = typeof SUPPLIER_TYPES[number];

export function formatUSAddress(city:string,state:string,zipCode:string,country="United States"){
  return [city,[state,zipCode].filter(Boolean).join(" "),country].filter(Boolean).join(", ");
}
