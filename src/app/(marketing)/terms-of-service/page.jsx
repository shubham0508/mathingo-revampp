import TermsOfService from "@/components/marketing/termsOfService";
import Script from 'next/script';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: "Mathz AI Terms of Service – User Agreement & Service Terms",
  description: "Read Mathz AI's terms of service and user agreement. Understand your rights and responsibilities when using our AI-powered math learning platform.",
  keywords: [
    'mathz ai terms of service', 'user agreement', 'service terms',
    'educational platform terms', 'AI tutoring terms', 'user responsibilities'
  ],
  authors: [{ name: "Mathz AI Legal Team", url: siteConfig.url }],
  creator: "Mathz AI",
  publisher: "Mathz AI",
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: `${siteConfig.url}/terms-of-service`,
  },
  openGraph: {
    title: "Mathz AI Terms of Service – User Agreement & Service Terms",
    description: "Read Mathz AI's terms of service and user agreement. Understand your rights and responsibilities when using our platform.",
    url: `${siteConfig.url}/terms-of-service`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    site: "@mathzai",
    title: "Mathz AI Terms of Service",
    description: "Read our terms of service and user agreement for the Mathz AI platform.",
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Mathz AI Terms of Service",
  "description": "Terms of service and user agreement for Mathz AI platform",
  "url": `${siteConfig.url}/terms-of-service`,
  "isPartOf": {
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url
  },
  "dateModified": new Date().toISOString().split('T')[0],
  "inLanguage": "en-US",
  "publisher": {
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url
  }
};

const TermsOfServicePage = () => {
  return (
    <>
      <Script
        id="terms-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(termsJsonLd),
        }}
      />
      <TermsOfService />
    </>
  );
};

export default TermsOfServicePage;