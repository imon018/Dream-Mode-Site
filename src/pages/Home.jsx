import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import CategoryGrid from "../components/CategoryGrid";
import OfferBanner from "../components/OfferBanner";
import AnimatedWrapper from "../components/ui/AnimatedWrapper";

export default function Home() {
  return (
    <AnimatedWrapper>
      <Hero />
      <FeaturedProducts />
      <CategoryGrid />
      <OfferBanner />
    </AnimatedWrapper>
  );
}
