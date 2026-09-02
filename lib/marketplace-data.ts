import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Box,
  CheckCircle2,
  Droplet,
  Flame,
  Gift,
  Home,
  Lock,
  Package,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  FileText,
} from "lucide-react";

export type CategoryItem = {
  title: string;
  description: string;
  moq: string;
  icon: LucideIcon;
  image: string;
};

export type MakerCardItem = {
  slug: string;
  name: string;
  specialty: string;
  location: string;
  rating: string;
  moq: string;
  leadTime: string;
  image: string;
  alt: string;
  portfolio: string[];
};

export type MakerReview = {
  author: string;
  date: string;
  rating: number;
  text: string;
  project?: string;
};

export type Manufacturer = {
  id: string;
  slug: string;
  businessName: string;
  specialty: string;
  category: string;
  location: string;
  country: string;
  supplierType: "Packaging Manufacturer" | "Packaging Supplier" | "Contract Packager / Co-packer";
  businessLocation: { city: string; state: string; zipCode: string; country: "United States" };
  facilityLocation: { city: string; state: string; zipCode: string; country: "United States" };
  shippingStates: string[];
  packagingTypes: string[];
  printingMethods: string[];
  finishingCapabilities: string[];
  fillingCapabilities: string[];
  assemblyAndKitting: boolean;
  prototypeAvailable: boolean;
  industriesServed: string[];
  usBasedCompany: boolean;
  usManufacturing: boolean;
  originClaim: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  fullDescription: string;
  image: string;
  alt: string;
  portfolioImages: Array<{ src: string; alt: string }>;
  moq: string;
  moqValue: number;
  leadTime: string;
  leadTimeValue: number;
  sampleAvailable: boolean;
  sampleLeadTime: string;
  monthlyCapacity: string;
  yearsInBusiness: number;
  teamSize: string;
  shippingRegions: string[];
  languages: string[];
  supportedProductTypes: string[];
  materials: string[];
  customizationOptions: string[];
  privateLabel: boolean;
  packagingSupport: boolean;
  designSupport: boolean;
  capabilities: string[];
  acceptedProjectTypes: string[];
  customizationLevel: string;
  tags: string[];
  reviews: MakerReview[];
};

export type ProjectCardItem = {
  title: string;
  category: string;
  quantity: string;
  budget: string;
  timeline: string;
  delivery: string;
  image: string;
  alt: string;
};

export const navLinks = [
  "Find Makers",
  "How It Works",
  "Categories",
  "For Manufacturers",
];

export const trustItems: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Verified makers",
    description: "Trade only with vetted small-batch manufacturers.",
    icon: ShieldCheck,
  },
  {
    title: "Sample approval",
    description: "Approve every sample before production begins.",
    icon: CheckCircle2,
  },
  {
    title: "Secure milestone payments",
    description: "Release funds only when each milestone is met.",
    icon: Lock,
  },
  {
    title: "Order protection",
    description: "Guarantees for quality, timing, and custom specs.",
    icon: Package,
  },
];

export const categories: CategoryItem[] = [
  {
    title: "Candles",
    description: "Warm scents, custom labels and small-batch batches.",
    moq: "MOQ 100 pcs",
    icon: Flame,
    image: "/images/candles.png",
  },
  {
    title: "Beauty & Skincare",
    description: "Serums, balms and private label beauty runs.",
    moq: "MOQ 120 pcs",
    icon: Droplet,
    image: "/images/beauty-skincare.png",
  },
  {
    title: "Textile Accessories",
    description: "Scrunchies, scarves and small-run textile goods.",
    moq: "MOQ 150 pcs",
    icon: Scissors,
    image: "/images/textile-accessories.png",
  },
  {
    title: "Bags & Pouches",
    description: "Cosmetic bags, pouches and private label totes.",
    moq: "MOQ 130 pcs",
    icon: ShoppingBag,
    image: "/images/bags-pouches.png",
  },
  {
    title: "Notebooks & Print",
    description: "Journals, notebooks and branded stationery.",
    moq: "MOQ 200 pcs",
    icon: BookOpen,
    image: "/images/notebooks-print.png",
  },
  {
    title: "Packaging",
    description: "Retail-ready boxes, sleeves and gift packaging.",
    moq: "MOQ 250 pcs",
    icon: Box,
    image: "/images/packaging.png",
  },
  {
    title: "Home & Lifestyle",
    description: "Decor, kitchenware and boutique lifestyle goods.",
    moq: "MOQ 180 pcs",
    icon: Home,
    image: "/images/home-lifestyle.png",
  },
  {
    title: "Gifts",
    description: "Curated gift sets, bundles and retail-ready offers.",
    moq: "MOQ 100 pcs",
    icon: Gift,
    image: "/images/gifts.png",
  },
];

export const howItWorksSteps = [
  {
    title: "Post your project",
    description: "Share your product idea, volume and packaging needs.",
    icon: FileText,
  },
  {
    title: "Compare maker quotes",
    description: "Review offers with price, MOQ and sample options.",
    icon: Sparkles,
  },
  {
    title: "Approve your sample",
    description: "Confirm the sample design before full production.",
    icon: CheckCircle2,
  },
  {
    title: "Start production",
    description: "Launch your batch with milestone-based delivery.",
    icon: Truck,
  },
];

const legacyManufacturers = [
  {
    id: "atelier-lumen",
    slug: "atelier-lumen",
    businessName: "Atelier Lumen",
    specialty: "Candle Studio",
    category: "Candles",
    location: "Grasse, France",
    country: "France",
    verified: true,
    rating: 5,
    reviewCount: 42,
    shortDescription: "A fragrance-led candle studio creating thoughtful small-batch collections for independent brands.",
    fullDescription: "Atelier Lumen combines traditional candle making with precise fragrance development and modern private-label production. The studio supports growing brands from early sampling through finished, retail-ready batches, with a focus on considered materials and consistent quality.",
    moq: "100 pcs",
    moqValue: 100,
    leadTime: "3–4 weeks",
    leadTimeValue: 24,
    sampleAvailable: true,
    sampleLeadTime: "7–10 days",
    monthlyCapacity: "8,000 pcs",
    yearsInBusiness: 9,
    teamSize: "8–12 people",
    shippingRegions: ["Europe", "United Kingdom", "North America"],
    languages: ["English", "French"],
    supportedProductTypes: ["Scented candles", "Travel candles", "Gift sets"],
    materials: ["Soy wax", "Rapeseed wax", "Cotton wicks", "Glass vessels"],
    customizationOptions: ["Custom fragrance", "Vessel color", "Labels", "Gift boxes"],
    privateLabel: true,
    packagingSupport: true,
    designSupport: true,
    capabilities: ["Fragrance development", "Small-batch pouring", "Label application", "Kitting"],
    acceptedProjectTypes: ["New collections", "Seasonal runs", "Corporate gifting"],
    customizationLevel: "Full custom and private label",
    tags: ["Eco-friendly", "Private label"],
    image: "/images/maker-candle-studio.png",
    alt: "Candle studio workspace",
    portfolioImages: [
      { src: "/images/maker-candle-studio.png", alt: "Candles being prepared at Atelier Lumen" },
      { src: "/images/candles.png", alt: "Finished small-batch candle collection" },
      { src: "/images/gifts.png", alt: "Gift-ready candle packaging" },
      { src: "/images/packaging.png", alt: "Custom candle boxes and labels" },
    ],
    reviews: [
      { author: "Morrow Home", date: "May 18, 2026", rating: 5, project: "Signature candle collection", text: "Beautiful sampling process and exceptionally consistent fragrance across the full run." },
      { author: "Elena Park", date: "February 6, 2026", rating: 5, project: "Retail launch", text: "Clear communication, careful packaging, and every milestone arrived on time." },
      { author: "Common Form", date: "October 21, 2025", rating: 5, text: "A thoughtful production partner who made our first private-label order feel straightforward." },
    ],
  },
  {
    id: "stitch-and-stone",
    slug: "stitch-and-stone",
    businessName: "Stitch & Stone",
    specialty: "Textile Atelier",
    category: "Textile Accessories",
    location: "London, UK",
    country: "UK",
    verified: true,
    rating: 4.9,
    reviewCount: 36,
    shortDescription: "A compact London atelier producing refined textile accessories in flexible, brand-friendly runs.",
    fullDescription: "Stitch & Stone works with independent fashion and lifestyle labels on carefully finished textile accessories. Its experienced team handles pattern refinement, sourcing, sampling and production under one roof, making smaller launches easier to manage.",
    moq: "50 pcs",
    moqValue: 50,
    leadTime: "2–3 weeks",
    leadTimeValue: 18,
    sampleAvailable: true,
    sampleLeadTime: "5–7 days",
    monthlyCapacity: "5,000 pcs",
    yearsInBusiness: 7,
    teamSize: "6–10 people",
    shippingRegions: ["Europe", "United Kingdom", "North America"],
    languages: ["English", "Italian"],
    supportedProductTypes: ["Scrunchies", "Scarves", "Pouches", "Soft accessories"],
    materials: ["Linen", "Cotton", "Silk", "Recycled polyester"],
    customizationOptions: ["Custom patterns", "Embroidery", "Woven labels", "Color matching"],
    privateLabel: true,
    packagingSupport: true,
    designSupport: true,
    capabilities: ["Pattern cutting", "Sewing", "Embroidery", "Finishing"],
    acceptedProjectTypes: ["Pilot runs", "Retail collections", "Limited editions"],
    customizationLevel: "Full custom",
    tags: ["Small batch", "High end"],
    image: "/images/maker-textile-atelier.png",
    alt: "Textile atelier interior",
    portfolioImages: [
      { src: "/images/maker-textile-atelier.png", alt: "Stitch and Stone textile atelier" },
      { src: "/images/textile-accessories.png", alt: "Small-batch textile accessories" },
      { src: "/images/bags-pouches.png", alt: "Custom fabric pouches" },
      { src: "/images/project-satin-scrunchies.png", alt: "Branded satin scrunchie production" },
    ],
    reviews: [
      { author: "Aster Goods", date: "June 2, 2026", rating: 5, project: "Linen accessory line", text: "The finish quality was excellent and the atelier accommodated our smaller opening quantity." },
      { author: "Studio Nami", date: "January 14, 2026", rating: 5, project: "Silk scarf run", text: "Helpful material guidance and accurate color matching from sample to production." },
      { author: "Row & Field", date: "September 9, 2025", rating: 4, text: "Responsive, skilled, and very reliable on a detailed sewing project." },
    ],
  },
  {
    id: "pressed-studio",
    slug: "pressed-studio",
    businessName: "Pressed Studio",
    specialty: "Print & Packaging",
    category: "Packaging",
    location: "Berlin, Germany",
    country: "Germany",
    verified: true,
    rating: 5,
    reviewCount: 28,
    shortDescription: "A specialist print studio for tactile stationery, premium packaging and polished short-run launches.",
    fullDescription: "Pressed Studio brings together print production, paper sourcing and structural packaging support for boutique brands. The team is especially experienced in premium finishes and can coordinate prototypes, print, assembly and delivery.",
    moq: "200 pcs",
    moqValue: 200,
    leadTime: "10–14 days",
    leadTimeValue: 12,
    sampleAvailable: false,
    sampleLeadTime: "Digital proof in 2–3 days",
    monthlyCapacity: "25,000 pcs",
    yearsInBusiness: 11,
    teamSize: "12–18 people",
    shippingRegions: ["Europe", "United Kingdom"],
    languages: ["English", "German"],
    supportedProductTypes: ["Folding boxes", "Labels", "Notebooks", "Cards"],
    materials: ["FSC paper", "Recycled board", "Linen paper", "Kraft board"],
    customizationOptions: ["Foil stamping", "Embossing", "Die cutting", "Custom inserts"],
    privateLabel: true,
    packagingSupport: true,
    designSupport: true,
    capabilities: ["Offset printing", "Digital printing", "Foil finishing", "Box assembly"],
    acceptedProjectTypes: ["Packaging launches", "Stationery", "Retail print"],
    customizationLevel: "Structural and print customization",
    tags: ["Eco packaging", "Custom foil"],
    image: "/images/maker-print-studio.png",
    alt: "Packaging and stationery studio",
    portfolioImages: [
      { src: "/images/maker-print-studio.png", alt: "Pressed Studio print workspace" },
      { src: "/images/packaging.png", alt: "Premium custom packaging" },
      { src: "/images/notebooks-print.png", alt: "Foil-stamped notebook collection" },
      { src: "/images/project-linen-notebooks.png", alt: "Linen notebooks produced for a brand" },
    ],
    reviews: [
      { author: "Northline", date: "April 22, 2026", rating: 5, project: "Retail packaging refresh", text: "Sharp print quality, excellent paper recommendations, and a smooth approval process." },
      { author: "Mila Studio", date: "December 8, 2025", rating: 5, project: "Foil stationery", text: "Our foil details came out beautifully and production was faster than expected." },
      { author: "Kindred Supply", date: "August 17, 2025", rating: 5, text: "Precise, communicative, and genuinely helpful with structural packaging decisions." },
    ],
  },
  {
    id: "luna-atelier", slug: "luna-atelier", businessName: "Luna Atelier", specialty: "Beauty & Skincare", category: "Beauty & Skincare", location: "Paris, France", country: "France", verified: false, rating: 4.8, reviewCount: 19,
    shortDescription: "A Paris formulation partner for gentle skincare and elevated private-label beauty collections.",
    fullDescription: "Luna Atelier develops and fills boutique skincare ranges with a practical path from formula selection to finished product. The studio offers flexible customization, ingredient guidance and coordinated packaging for emerging beauty brands.",
    image: "/images/beauty-skincare.png", alt: "Beauty product studio", moq: "120 pcs", moqValue: 120, leadTime: "4–5 weeks", leadTimeValue: 28, sampleAvailable: true, sampleLeadTime: "10–14 days", monthlyCapacity: "12,000 units", yearsInBusiness: 6, teamSize: "8–14 people",
    shippingRegions: ["Europe", "United Kingdom"], languages: ["English", "French"], supportedProductTypes: ["Face serums", "Balms", "Body oils", "Cleansers"], materials: ["Plant oils", "Natural waxes", "Glass packaging", "Recycled plastic"], customizationOptions: ["Fragrance", "Active ingredients", "Labels", "Secondary packaging"], privateLabel: true, packagingSupport: true, designSupport: false, capabilities: ["Formulation", "Stability testing", "Filling", "Labeling"], acceptedProjectTypes: ["Private label", "Formula customization", "Gift sets"], customizationLevel: "Private label with formula options", tags: ["Private label", "Organic"],
    portfolioImages: [{ src: "/images/beauty-skincare.png", alt: "Luna Atelier skincare products" }, { src: "/images/hero-products-clean.png", alt: "Clean beauty collection" }, { src: "/images/packaging.png", alt: "Beauty product packaging" }],
    reviews: [{ author: "Onda Skin", date: "May 5, 2026", rating: 5, project: "Facial oil launch", text: "Excellent ingredient guidance and a beautifully finished first batch." }, { author: "Amelie Rose", date: "January 27, 2026", rating: 5, text: "Patient throughout sampling and very clear about every production decision." }, { author: "Soft Matter", date: "July 11, 2025", rating: 4, project: "Body balm collection", text: "Strong product quality and thoughtful packaging coordination." }],
  },
  {
    id: "harbor-works", slug: "harbor-works", businessName: "Harbor Works", specialty: "Home & Lifestyle", category: "Home & Lifestyle", location: "Seville, Spain", country: "Spain", verified: true, rating: 4.7, reviewCount: 24,
    shortDescription: "A craft-focused workshop producing warm, functional homeware for distinctive lifestyle brands.",
    fullDescription: "Harbor Works partners with home and hospitality brands on ceramic and mixed-material goods made in manageable runs. Its workshop supports shape refinement, glaze selection, branded details and careful export packaging.",
    image: "/images/home-lifestyle.png", alt: "Home lifestyle studio", moq: "150 pcs", moqValue: 150, leadTime: "3–4 weeks", leadTimeValue: 24, sampleAvailable: false, sampleLeadTime: "Prototype in 14–18 days", monthlyCapacity: "4,500 pcs", yearsInBusiness: 13, teamSize: "10–16 people",
    shippingRegions: ["Europe", "United Kingdom", "North America"], languages: ["English", "Spanish"], supportedProductTypes: ["Ceramic vessels", "Tableware", "Decor objects", "Gift sets"], materials: ["Stoneware", "Porcelain", "Cork", "Recycled paper"], customizationOptions: ["Custom shapes", "Glazes", "Stamped marks", "Gift packaging"], privateLabel: true, packagingSupport: true, designSupport: true, capabilities: ["Slip casting", "Hand finishing", "Glazing", "Protective packing"], acceptedProjectTypes: ["Home collections", "Hospitality", "Corporate gifting"], customizationLevel: "Custom forms and finishes", tags: ["Ceramics", "Custom"],
    portfolioImages: [{ src: "/images/home-lifestyle.png", alt: "Harbor Works homeware collection" }, { src: "/images/gifts.png", alt: "Curated lifestyle gift set" }, { src: "/images/hero-products-clean.png", alt: "Finished lifestyle products" }],
    reviews: [{ author: "Casa Norte", date: "March 19, 2026", rating: 5, project: "Ceramic vessel range", text: "Beautiful glaze consistency and excellent protective packaging." }, { author: "Gather Hotel", date: "November 3, 2025", rating: 4, project: "Hospitality tableware", text: "The team translated our references into a practical, durable collection." }, { author: "Sunday Objects", date: "June 28, 2025", rating: 5, text: "A dependable workshop with real attention to finish and detail." }],
  },
];

const usProfiles: Array<Pick<Manufacturer,"supplierType"|"businessLocation"|"facilityLocation"|"shippingRegions"|"shippingStates"|"packagingTypes"|"printingMethods"|"finishingCapabilities"|"fillingCapabilities"|"assemblyAndKitting"|"prototypeAvailable"|"industriesServed"|"usBasedCompany"|"usManufacturing"|"originClaim"> & Partial<Pick<Manufacturer,"specialty"|"category">>> = [
  {supplierType:"Contract Packager / Co-packer",specialty:"Beauty & Personal Care Co-packer",category:"Beauty & Personal Care",businessLocation:{city:"Austin",state:"TX",zipCode:"78744",country:"United States"},facilityLocation:{city:"Austin",state:"TX",zipCode:"78744",country:"United States"},shippingRegions:["South","Nationwide"],shippingStates:["TX","OK","LA","AR","NM"],packagingTypes:["Bottles & jars","Tubes","Labels","Folding cartons"],printingMethods:["Digital printing","Label printing"],finishingCapabilities:["Matte coating","Foil stamping"],fillingCapabilities:["Liquids","Oils","Creams & lotions","Gels"],assemblyAndKitting:true,prototypeAvailable:true,industriesServed:["Beauty & Personal Care","Health & Wellness"],usBasedCompany:true,usManufacturing:true,originClaim:"Filled and packed in Texas using domestic and imported components."},
  {supplierType:"Packaging Manufacturer",specialty:"Flexible Packaging Manufacturer",category:"Food & Beverage",businessLocation:{city:"Chicago",state:"IL",zipCode:"60632",country:"United States"},facilityLocation:{city:"Joliet",state:"IL",zipCode:"60431",country:"United States"},shippingRegions:["Midwest","Nationwide"],shippingStates:["IL","IN","WI","MI","OH","IA"],packagingTypes:["Flexible pouches","Labels","Mailers"],printingMethods:["Flexographic printing","Digital printing"],finishingCapabilities:["Matte coating","Gloss coating","Die cutting"],fillingCapabilities:[],assemblyAndKitting:false,prototypeAvailable:true,industriesServed:["Food & Beverage","Pet Care","Retail"],usBasedCompany:true,usManufacturing:true,originClaim:"Packaging converted and printed at the Illinois facility; film origin varies by specification."},
  {supplierType:"Packaging Manufacturer",specialty:"Paperboard & Corrugated Packaging",category:"Retail & E-commerce",businessLocation:{city:"Allentown",state:"PA",zipCode:"18109",country:"United States"},facilityLocation:{city:"Allentown",state:"PA",zipCode:"18109",country:"United States"},shippingRegions:["Northeast","Nationwide"],shippingStates:["PA","NY","NJ","DE","MD","MA"],packagingTypes:["Folding cartons","Corrugated boxes","Rigid boxes","Retail displays"],printingMethods:["Offset printing","Digital printing","Flexographic printing"],finishingCapabilities:["Foil stamping","Embossing","Spot UV","Die cutting"],fillingCapabilities:[],assemblyAndKitting:true,prototypeAvailable:true,industriesServed:["Retail","E-commerce","Beauty & Personal Care","Food & Beverage"],usBasedCompany:true,usManufacturing:true,originClaim:"Boxes are manufactured in Pennsylvania; paper content and component origin depend on the selected material."},
  {supplierType:"Packaging Supplier",specialty:"Stock Containers & Closures",category:"Health & Wellness",businessLocation:{city:"Los Angeles",state:"CA",zipCode:"90021",country:"United States"},facilityLocation:{city:"Reno",state:"NV",zipCode:"89502",country:"United States"},shippingRegions:["West","Nationwide"],shippingStates:["CA","NV","OR","WA","AZ","UT"],packagingTypes:["Bottles & jars","Tubes","Cans & tins"],printingMethods:["Screen printing","Direct-to-container printing","Label printing"],finishingCapabilities:["Matte coating","Gloss coating"],fillingCapabilities:[],assemblyAndKitting:false,prototypeAvailable:false,industriesServed:["Beauty & Personal Care","Supplements","Household Products"],usBasedCompany:true,usManufacturing:false,originClaim:"U.S.-based supplier; container country of origin is provided per SKU."},
  {supplierType:"Contract Packager / Co-packer",specialty:"Food & Beverage Co-packer",category:"Food & Beverage",businessLocation:{city:"Charlotte",state:"NC",zipCode:"28208",country:"United States"},facilityLocation:{city:"Gastonia",state:"NC",zipCode:"28054",country:"United States"},shippingRegions:["South","Northeast"],shippingStates:["NC","SC","GA","VA","TN","FL"],packagingTypes:["Flexible pouches","Bottles & jars","Folding cartons","Labels"],printingMethods:["Label printing"],finishingCapabilities:[],fillingCapabilities:["Dry goods","Powders","Liquids","Food products","Beverages"],assemblyAndKitting:true,prototypeAvailable:true,industriesServed:["Food & Beverage","Supplements","Pet Care"],usBasedCompany:true,usManufacturing:true,originClaim:"Products are packed in North Carolina; ingredient and packaging origin varies by project."},
];

export const manufacturers: Manufacturer[] = legacyManufacturers.map((maker,index)=>{
  const profile=usProfiles[index];
  return {...maker,...profile,location:`${profile.businessLocation.city}, ${profile.businessLocation.state} ${profile.businessLocation.zipCode}, United States`,country:"United States",materials:maker.materials};
});

export const getManufacturerBySlug = (slug: string) =>
  manufacturers.find((maker) => maker.slug === slug);

export const featuredMakers: MakerCardItem[] = manufacturers.slice(0, 3).map((maker) => ({
  slug: maker.slug,
  name: maker.businessName,
  specialty: maker.specialty,
  location: maker.location,
  rating: maker.rating.toFixed(1),
  moq: maker.moq,
  leadTime: maker.leadTime,
  image: maker.image,
  alt: maker.alt,
  portfolio: maker.tags,
}));

export const exampleProjects: ProjectCardItem[] = [
  {
    title: "100 soy candles with custom labels",
    category: "Candles",
    quantity: "100 pcs",
    budget: "$3,200",
    timeline: "14 days",
    delivery: "NYC",
    image: "/images/project-custom-candles.png",
    alt: "100 soy candles with custom labels",
  },
  {
    title: "250 branded satin scrunchies",
    category: "Textile Accessories",
    quantity: "250 pcs",
    budget: "$1,450",
    timeline: "12 days",
    delivery: "Los Angeles",
    image: "/images/project-satin-scrunchies.png",
    alt: "250 branded satin scrunchies",
  },
  {
    title: "500 linen notebooks with foil stamp",
    category: "Notebooks & Print",
    quantity: "500 pcs",
    budget: "$4,800",
    timeline: "18 days",
    delivery: "Toronto",
    image: "/images/project-linen-notebooks.png",
    alt: "500 linen notebooks with foil stamp",
  },
  {
    title: "300 padded cosmetic pouches",
    category: "Bags & Pouches",
    quantity: "300 pcs",
    budget: "$2,600",
    timeline: "16 days",
    delivery: "Amsterdam",
    image: "/images/project-cosmetic-pouch.png",
    alt: "300 padded cosmetic pouches",
  },
];

export const protectionHighlights = [
  "Sample approval before production",
  "Exact product specification",
  "Milestone payments",
  "Stored files and agreements",
  "Dispute resolution",
  "Verified reviews",
];

export const footerLinks = {
  marketplace: ["Browse makers", "Post a project", "Categories"],
  manufacturers: ["Join as a maker", "How it works", "Success stories"],
  resources: ["Guides", "Support", "FAQs"],
  company: ["About", "Careers", "Contact"],
};
