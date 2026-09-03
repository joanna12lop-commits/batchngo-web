import StaticInfoPage from "../../components/StaticInfoPage";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Terms",description:"Draft terms information for the BatchNGo prototype.",alternates:{canonical:"/terms"},robots:{index:false,follow:false}};
export default function TermsPage(){return <StaticInfoPage eyebrow="Legal" title="Terms are being finalized" description="The production version of the marketplace terms will be published before accounts, payments or binding project submissions are enabled."/>;}
