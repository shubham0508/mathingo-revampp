import Footer from "@/components/layout/footer";
import FloatingHelpButton from "@/components/marketing/sections/ask-us-modal";
import FAQs from "@/components/marketing/sections/faqs";
import FeaturesSection from "@/components/marketing/sections/features-section";
import { HeroSection } from "@/components/marketing/sections/hero-section";
import LANDINGPAGEEightPage from "@/components/marketing/sections/product-overview";
import UniqueFeaturesSection from "@/components/marketing/sections/products-showcase";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `${siteConfig.name} - Your #1 Math Buddy`,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} - Your #1 Math Buddy`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Your #1 Math Buddy`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@mathzai",
  },
};

export default function HomePage() {
  return (
    <div className="overflow-hidden relative">
      <HeroSection />
      <FeaturesSection />
      <UniqueFeaturesSection />
      <LANDINGPAGEEightPage />
      <FAQs />
      <FloatingHelpButton />
      <Footer />
    </div>
  );
}