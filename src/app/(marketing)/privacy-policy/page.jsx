import PrivacyPolicy from "@/components/marketing/privacyPolicy";
import Script from 'next/script';
import { siteConfig } from '@/config/site';

export const metadata = {
    title: "Mathz AI Privacy Policy – How We Protect Your Data & Privacy",
    description: "Read Mathz AI's comprehensive privacy policy. Learn how we collect, use, and protect your personal information while providing AI-powered math learning services.",
    keywords: [
        'mathz ai privacy policy', 'data protection', 'user privacy',
        'educational data privacy', 'GDPR compliance', 'student privacy'
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
        canonical: `${siteConfig.url}/privacy-policy`,
    },
    openGraph: {
        title: "Mathz AI Privacy Policy – How We Protect Your Data & Privacy",
        description: "Read Mathz AI's comprehensive privacy policy. Learn how we collect, use, and protect your personal information responsibly.",
        url: `${siteConfig.url}/privacy-policy`,
        siteName: siteConfig.name,
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary",
        site: "@mathzai",
        title: "Mathz AI Privacy Policy",
        description: "Learn how Mathz AI protects your privacy and data responsibly.",
    },
};

const privacyJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Mathz AI Privacy Policy",
    "description": "Privacy policy for Mathz AI platform",
    "url": `${siteConfig.url}/privacy-policy`,
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

const PrivacyPolicyPage = () => {
    return (
        <>
            <Script
                id="privacy-schema"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(privacyJsonLd),
                }}
            />
            <PrivacyPolicy />
        </>
    );
};

export default PrivacyPolicyPage;