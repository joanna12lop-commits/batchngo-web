import StaticInfoPage from "../../components/StaticInfoPage";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Contact",description:"Contact options for BatchNGo are being prepared.",alternates:{canonical:"/contact"},robots:{index:false,follow:false}};
export default function ContactPage(){return <StaticInfoPage eyebrow="Contact" title="Contact options are coming soon" description="Direct support and marketplace contact channels will be connected with the backend and account system." actionHref="/find-makers" actionLabel="Explore makers"/>;}
