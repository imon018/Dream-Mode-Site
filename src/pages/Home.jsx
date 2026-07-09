import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import DeliveryInfo from "../components/DeliveryInfo";
import OfferBanner from "../components/OfferBanner";
import AnimatedWrapper from "../components/ui/AnimatedWrapper";

export default function Home() {
  return (
    <AnimatedWrapper>
      <Hero />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <DeliveryInfo />
      <OfferBanner />
    </AnimatedWrapper>
  );
}
