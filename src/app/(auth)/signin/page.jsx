import { AuthFlow } from "@/components/auth";
import Script from 'next/script';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';

export async function generateMetadata() {
    const pageUrl = `${siteConfig.url}/login`;
    const metadata = generatePageMetadata({
        title: 'Sign In - Access Your MathzAI Account',
        description: `Sign in to your ${siteConfig.name} account to access personalized math learning tools, track progress, and get AI-powered assistance.`,
        url: pageUrl,
    });
    return metadata;
}

export default function LoginPage() {
    const pageUrl = `${siteConfig.url}/login`;

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Sign In to MathzAI",
        "description": `Securely sign in to your ${siteConfig.name} account to continue your personalized math learning journey.`,
        "url": pageUrl,
        "isPartOf": createWebsiteSchema(),
        "publisher": createOrganizationSchema(),
        "mainEntity": {
            "@type": "WebContent",
            "name": "Sign In Form",
            "description": "Form to allow users to sign in to their MathzAI account."
        }
    };

    return (
        <>
            <Script
                id="login-page-schema"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
            <Script
                id="website-schema-login"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebsiteSchema()) }}
            />
            <AuthFlow initialStep="signIn" />
        </>
    );
}