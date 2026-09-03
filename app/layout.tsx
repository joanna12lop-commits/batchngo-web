import type { Metadata } from "next";
import { Geist,Geist_Mono } from "next/font/google";
import "./globals.css";
import DraftSyncProvider from "../components/DraftSyncProvider";
import { safeJsonLd,SITE_URL } from "../lib/seo";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
const description="BatchNGo helps emerging brands prepare production projects and explore small-batch manufacturing partners.";
export const metadata:Metadata={metadataBase:new URL(SITE_URL),title:{default:"BatchNGo — Small-Batch Manufacturing Marketplace",template:"%s | BatchNGo"},description,openGraph:{siteName:"BatchNGo",type:"website",url:"/",title:"BatchNGo — Small-Batch Manufacturing Marketplace",description},twitter:{card:"summary_large_image",title:"BatchNGo — Small-Batch Manufacturing Marketplace",description}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){const jsonLd={"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"BatchNGo","url":SITE_URL},{"@type":"Organization","name":"BatchNGo","url":SITE_URL}]};return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full bg-[#F6F3EE] text-[#1F2937]"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(jsonLd)}}/><DraftSyncProvider>{children}</DraftSyncProvider></body></html>}
