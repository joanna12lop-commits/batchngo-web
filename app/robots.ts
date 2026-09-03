import type{MetadataRoute}from"next";import{SITE_URL}from"../lib/seo.ts";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/api/","/auth/","/admin/","/dashboard/","/account","/login","/post-project","/for-manufacturers/apply","/request-quote/","/makers/"]},sitemap:`${SITE_URL}/sitemap.xml`,host:SITE_URL}}
