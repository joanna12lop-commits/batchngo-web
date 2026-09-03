import StaticInfoPage from "../../components/StaticInfoPage";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Privacy",description:"Draft privacy information for the BatchNGo prototype.",alternates:{canonical:"/privacy"},robots:{index:false,follow:false}};
export default function PrivacyPage(){return <StaticInfoPage eyebrow="Privacy" title="Privacy information" description="This frontend prototype stores drafts on your device. A complete privacy notice will be published before authenticated data collection is enabled."/>;}
