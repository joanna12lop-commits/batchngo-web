export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type AccountRole = "customer" | "manufacturer" | "admin";
export type ProjectStatus = "draft" | "submitted" | "under_review" | "matched" | "closed" | "rejected";
export type ManufacturerApplicationStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected";

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };
type Timestamps = { created_at: string; updated_at: string };

export interface Database {
  public: {
    Tables: {
      profiles: Table<Timestamps & { id:string; role:AccountRole; full_name:string|null; company_name:string|null; phone:string|null }, {id:string;role?:AccountRole;full_name?:string|null;company_name?:string|null;phone?:string|null}>;
      manufacturer_profiles: Table<Timestamps & { id:string; owner_id:string; slug:string; business_name:string; supplier_types:string[]; business_location:Json; facility_location:Json; shipping_regions:string[]; shipping_states:string[]; packaging_types:string[]; materials:string[]; printing_methods:string[]; finishing_capabilities:string[]; filling_capabilities:string[]; industries_served:string[]; assembly_and_kitting:boolean; sample_available:boolean; prototype_available:boolean; typical_moq:number|null; lead_time_days:number|null; monthly_capacity:number|null; us_based_company:boolean; us_manufacturing:boolean; origin_claim:string|null; description:string|null; status:ManufacturerApplicationStatus }, Record<string,unknown>>;
      manufacturer_applications: Table<Timestamps & { id:string; owner_id:string; manufacturer_profile_id:string|null; client_draft_id:string|null; status:ManufacturerApplicationStatus; application_data:Json; submitted_at:string|null; reviewed_at:string|null }, Record<string,unknown>>;
      projects: Table<Timestamps & { id:string; customer_id:string; client_draft_id:string|null; category_id:string|null; title:string; description:string; status:ProjectStatus; technical_details:Json; quantity:number|null; minimum_budget_cents:number|null; maximum_budget_cents:number|null; currency:"USD"; timeline:Json; shipping_address:Json; submitted_at:string|null }, Record<string,unknown>>;
      project_files: Table<{ id:string; project_id:string; owner_id:string; storage_path:string; file_name:string; mime_type:string|null; size_bytes:number|null; created_at:string }, Record<string,unknown>>;
      project_matches: Table<Timestamps & { id:string; project_id:string; manufacturer_profile_id:string; status:"invited"|"viewed"|"interested"|"quoted"|"accepted"|"declined"; matched_by:string|null; decline_reason:string|null; responded_at:string|null }, Record<string,unknown>>;
      quotes: Table<Timestamps & { id:string; project_id:string; manufacturer_profile_id:string; submitted_by:string; estimated_unit_price_cents:number|null; minimum_unit_price_cents:number|null; maximum_unit_price_cents:number|null; currency:"USD"; moq:number; tooling_setup_cost_cents:number|null; sample_available:boolean; sample_cost_cents:number|null; lead_time_days:number|null; production_location:Json; message:string|null; expires_at:string; status:"draft"|"submitted"|"accepted"|"declined"|"withdrawn"; submitted_at:string|null }, Record<string,unknown>>;
      categories: Table<{ id:string; slug:string; name:string; description:string|null; active:boolean; sort_order:number; created_at:string }, Record<string,unknown>>;
      notifications: Table<{ id:string; recipient_id:string; type:string; title:string; body:string; data:Json; read_at:string|null; created_at:string }, Record<string,unknown>>;
      admin_events: Table<{ id:string; actor_id:string|null; event_type:string; entity_type:string; entity_id:string|null; payload:Json; created_at:string }, Record<string,unknown>>;
      admin_notes: Table<Timestamps & { id:string; entity_type:"project"|"manufacturer_application"; entity_id:string; note:string; created_by:string|null }, Record<string,unknown>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { account_role:AccountRole; project_status:ProjectStatus; manufacturer_application_status:ManufacturerApplicationStatus };
    CompositeTypes: Record<string, never>;
  };
}
