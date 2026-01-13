import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import VendorTypes from "@/components/landing/VendorTypes";
import FeaturedVendors from "@/components/landing/FeaturedVendors";
import Benefits from "@/components/landing/Benefits";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <Navbar />
      <HeroSection />
      {/* <Stats /> */}
      <HowItWorks />
      <VendorTypes />
      {/* <FeaturedVendors /> */}
      <Benefits />
      {/* <Testimonials /> */}
      <section id="faq">
        <FAQ />
      </section>
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
