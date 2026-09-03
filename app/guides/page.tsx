import StaticInfoPage from "../../components/StaticInfoPage";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Production Guides",description:"Production guidance is being prepared for BatchNGo.",alternates:{canonical:"/guides"},robots:{index:false,follow:false}};
export default function GuidesPage(){return <StaticInfoPage eyebrow="Resources" title="Production guides are being prepared" description="Practical guidance for preparing specifications, comparing quotes and managing small-batch production will be published here." actionHref="/post-project" actionLabel="Post a project"/>;}
