import type { Metadata } from "next";
export const SITE_URL="https://batchngo-web.vercel.app";
export const SITE_NAME="BatchNGo";
export function canonical(path="/"){return new URL(path,SITE_URL).toString()}
export function publicMetadata(title:string,description:string,path:string):Metadata{return{title,description,alternates:{canonical:path},openGraph:{title,description,url:path,siteName:SITE_NAME,type:"website"},twitter:{card:"summary_large_image",title,description}}}
export const NO_INDEX:Metadata={robots:{index:false,follow:false}};
export function safeJsonLd(value:unknown){return JSON.stringify(value).replace(/</g,"\\u003c")}
