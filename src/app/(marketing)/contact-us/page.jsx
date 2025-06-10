import Contact from '@/components/marketing/contactUs';
import { siteConfig } from '@/config/site';
import Script from 'next/script';

export const metadata = {
  title: "Contact Mathz AI – Get Support & Math Learning Assistance",
  description: "Need help with Mathz AI? Contact us for support, inquiries, or assistance with AI-powered math tutoring and homework solutions. We're here to help!",
  keywords: [
    'contact mathz ai', 'math tutoring support', 'AI math help',
    'customer service', 'math learning assistance', 'homework help support'
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
    canonical: `${siteConfig.url}/contact-us`,
  },
  openGraph: {
    title: "Contact Mathz AI – Get Support & Math Learning Assistance",
    description: "Need help with Mathz AI? Contact us for support, inquiries, or assistance with AI-powered math tutoring and homework solutions. We're here to help!",
    url: `${siteConfig.url}/contact-us`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.url}/images/contact-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact Mathz AI Support Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mathzai",
    creator: "@mathzai",
    title: "Contact Mathz AI – Get Support & Math Learning Assistance",
    description: "Need help with Mathz AI? Contact us for support, inquiries, or assistance with AI-powered math tutoring and homework solutions.",
    images: [`${siteConfig.url}/images/contact-og.jpg`],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Mathz AI",
  "description": "Contact page for Mathz AI - AI-powered math learning platform",
  "url": `${siteConfig.url}/contact-us`,
  "mainEntity": {
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English"],
      "serviceArea": "Worldwide"
    },
    "sameAs": [
      siteConfig.links.twitter,
      siteConfig.links.github
    ]
  }
};

const ContactPage = () => {
  return (
    <>
      <Script
        id="contact-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactJsonLd),
        }}
      />
      <Contact />
    </>
  );
};

export default ContactPage;