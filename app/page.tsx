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
