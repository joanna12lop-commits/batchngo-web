import StaticInfoPage from "../../components/StaticInfoPage";
import { publicMetadata } from "../../lib/seo";
export const metadata=publicMetadata("About","Learn how BatchNGo helps emerging brands organize production requirements and explore small-batch manufacturing partners.","/about");
export default function AboutPage(){return <StaticInfoPage eyebrow="About BatchNGo" title="Small-batch production, made easier" description="BatchNGo connects growing brands with production partners equipped for smaller runs, clear specifications and practical collaboration."/>;}
