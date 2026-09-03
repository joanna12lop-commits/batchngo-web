import Header from "../components/Header";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import CategoryGrid from "../components/CategoryGrid";
import HowItWorks from "../components/HowItWorks";
import FeaturedMakers from "../components/FeaturedMakers";
import ExampleProjects from "../components/ExampleProjects";
import ProtectionSection from "../components/ProtectionSection";
import ManufacturerCTA from "../components/ManufacturerCTA";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import { publicMetadata } from "../lib/seo";
export const metadata=publicMetadata("Small-Batch Manufacturing for Emerging Brands","Prepare a clear production project and explore small-batch manufacturing partners for your next product idea.","/");

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <CategoryGrid />
        <HowItWorks />
        <FeaturedMakers />
        <ExampleProjects />
        <ProtectionSection />
        <ManufacturerCTA />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
