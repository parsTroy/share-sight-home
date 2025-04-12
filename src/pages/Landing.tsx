
import { LandingHeader } from "@/components/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { CallToActionSection } from "@/components/landing/CallToActionSection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      
      <main className="flex-grow">
        <HeroSection />
        <PricingSection />
        <FeaturesSection />
        <TestimonialSection />
        <CallToActionSection />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
