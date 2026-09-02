import type{AccountRole}from"../supabase/database.types";
export function canReadQuote(role:AccountRole,viewerId:string,input:{projectCustomerId:string;manufacturerOwnerId:string}){if(role==="admin")return true;if(role==="customer")return viewerId===input.projectCustomerId;if(role==="manufacturer")return viewerId===input.manufacturerOwnerId;return false;}
