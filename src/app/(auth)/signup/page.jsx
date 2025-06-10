import { AuthFlow } from "@/components/auth";
import Script from 'next/script';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seoUtils';

export async function generateMetadata() {
  const pageUrl = `${siteConfig.url}/signup`;
  const metadata = generatePageMetadata({
    title: `Create Your ${siteConfig.name} Account - Start Learning Math`,
    description: `Sign up for a ${siteConfig.name} account to unlock personalized AI math tutoring, step-by-step solutions, and track your learning progress. Join today!`,
    url: pageUrl,
  });
  return metadata;
}

export default function SignupPage() {
  const pageUrl = `${siteConfig.url}/signup`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Sign Up for ${siteConfig.name}`,
    "description": `Create your free ${siteConfig.name} account to get access to AI-powered math help, including step-by-step solutions and personalized learning paths.`,
    "url": pageUrl,
    "isPartOf": createWebsiteSchema(),
    "publisher": createOrganizationSchema(),
    "mainEntity": {
      "@type": "WebContent",
      "name": "Sign Up Form",
      "description": `Form for users to create a new account on ${siteConfig.name}.`
    },
    "potentialAction": {
        "@type": "CreateAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": pageUrl 
        },
        "result": {
            "@type": "Person",
            "name": "{user_name}"
        }
    }
  };

  return (
    <>
      <Script
        id="signup-page-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="website-schema-signup"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebsiteSchema()) }}
      />
      <AuthFlow initialStep="signUpEmail" />
    </>
  );
}