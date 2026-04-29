import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryBanner from "@/components/home/CategoryBanner";
import SocialProof from "@/components/home/SocialProof";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <FeaturedProducts />
      <CategoryBanner />
      <HowItWorks />
      <SocialProof />
      <Newsletter />
    </>
  );
}
