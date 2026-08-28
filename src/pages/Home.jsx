import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsSection from "../components/StatsSection";
import TrustBanner from "../components/TrustBanner";
import AnimatedWrapper from "../components/ui/AnimatedWrapper";
import PremiumHighlights from "../components/PremiumHighlights";
import Newsletter from "../components/Newsletter";
import CategoryProducts from "../components/CategoryProducts";
import FacebookFollowBanner from "../components/FacebookFollowBanner";

export default function Home() {
  
  return (
  <div className="bg-[#FAF7F2]">
    <AnimatedWrapper>

      <Hero />

      <PremiumHighlights />

      <FeaturedProducts />

      <CategoryProducts />

      <WhyChooseUs />

      <StatsSection />

      <TrustBanner />

      <FacebookFollowBanner />

      <Newsletter />

    </AnimatedWrapper>
  </div>
);
}
