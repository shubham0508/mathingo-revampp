import AboutUs from "@/components/marketing/aboutUs";
import Script from 'next/script';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: "About Mathz AI – AI-Powered Math Learning & Tutoring Platform",
  description: "Discover how Mathz AI revolutionizes math learning with AI-powered tutoring, step-by-step solutions, and instant answer verification. Learn our story and mission.",
  keywords: [
    'about mathz ai', 'AI math tutoring', 'math learning platform',
    'educational technology', 'AI-powered homework help', 'math education innovation'
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
    canonical: `${siteConfig.url}/about-us`,
  },
  openGraph: {
    title: "About Mathz AI – AI-Powered Math Learning & Tutoring Platform",
    description: "Discover how Mathz AI revolutionizes math learning with AI-powered tutoring, step-by-step solutions, and instant answer verification.",
    url: `${siteConfig.url}/about-us`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.url}/images/about-og.jpg`,
        width: 1200,
        height: 630,
        alt: "About Mathz AI - AI-Powered Math Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mathzai",
    creator: "@mathzai",
    title: "About Mathz AI – AI-Powered Math Learning & Tutoring Platform",
    description: "Discover how Mathz AI revolutionizes math learning with AI-powered tutoring, step-by-step solutions, and instant answer verification.",
    images: [`${siteConfig.url}/images/about-og.jpg`],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Mathz AI",
  "description": "Learn about Mathz AI's mission to revolutionize math education through AI-powered tutoring",
  "url": `${siteConfig.url}/about-us`,
  "mainEntity": {
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "foundingDate": "2024",
    "industry": "Educational Technology",
    "serviceArea": "Worldwide",
    "logo": `${siteConfig.url}/logo.png`,
    "sameAs": [
      siteConfig.links.twitter,
      siteConfig.links.github
    ],
    "knowsAbout": [
      "Mathematics Education",
      "Artificial Intelligence",
      "Online Tutoring",
      "Educational Technology"
    ]
  }
};

const AboutUsPage = () => {
  return (
    <>
      <Script
        id="about-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd),
        }}
      />
      <AboutUs />
    </>
  );
};

export default AboutUsPage;