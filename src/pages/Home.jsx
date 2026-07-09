import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsSection from "../components/StatsSection";
import TrustBanner from "../components/TrustBanner";
import AnimatedWrapper from "../components/ui/AnimatedWrapper";

export default function Home() {
  return (
    <AnimatedWrapper>

      <Hero />

      <FeaturedProducts />

      <WhyChooseUs />

      <StatsSection />

      <TrustBanner />

    </AnimatedWrapper>
  );
}
