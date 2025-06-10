import Pricing from '@/components/marketing/pricing';
import Script from 'next/script';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: "Mathz AI Pricing – Affordable AI Math Learning Plans & Subscriptions",
  description: "Choose the perfect Mathz AI plan for your math learning needs. Compare our affordable pricing options for AI-powered tutoring, step-by-step solutions, and more!",
  keywords: [
    'mathz ai pricing', 'math tutoring plans', 'AI learning subscription',
    'affordable math help', 'educational pricing', 'math tutor cost',
    'homework help pricing', 'student discounts'
  ],
  authors: [{ name: "Mathz AI Team", url: siteConfig.url }],
  creator: "Mathz AI",
  publisher: "Mathz AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${siteConfig.url}/pricing`,
  },
  openGraph: {
    title: "Mathz AI Pricing – Affordable AI Math Learning Plans & Subscriptions",
    description: "Choose the perfect Mathz AI plan for your math learning needs. Compare our affordable pricing options for AI-powered tutoring and solutions!",
    url: `${siteConfig.url}/pricing`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.url}/images/pricing-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Mathz AI Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mathzai",
    creator: "@mathzai",
    title: "Mathz AI Pricing – Affordable AI Math Learning Plans",
    description: "Choose the perfect plan for AI-powered math learning. Compare our affordable subscription options!",
    images: [`${siteConfig.url}/images/pricing-og.jpg`],
  },
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "PriceSpecification",
  "name": "Mathz AI Pricing Plans",
  "description": "AI-powered math learning and tutoring service pricing plans",
  "url": `${siteConfig.url}/pricing`,
  "provider": {
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url
  },
  "serviceType": "Educational Technology",
  "category": "Math Learning Platform",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Plan",
      "description": "Basic math help and limited solutions",
      "price": "0",
      "priceCurrency": "USD"
    }
  ]
};

const PricingPage = () => {
  return (
    <>
      <Script
        id="pricing-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingJsonLd),
        }}
      />
      <Pricing status={"unauthenticated"} />
    </>
  );
};

export default PricingPage;