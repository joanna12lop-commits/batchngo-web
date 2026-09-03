import StaticInfoPage from "../../components/StaticInfoPage";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Support",description:"Support information for the BatchNGo prototype.",alternates:{canonical:"/support"},robots:{index:false,follow:false}};
export default function SupportPage(){return <StaticInfoPage eyebrow="Support" title="How can BatchNGo help?" description="Dedicated support will be connected with the backend. For now, use the guided project and manufacturer application flows to prepare your information." actionHref="/" actionLabel="Back to home"/>;}
