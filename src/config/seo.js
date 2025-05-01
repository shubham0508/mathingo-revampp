import { siteConfig } from "@/config/site";

export function generateMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = "website",
}) {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} - Your #1 Math Buddy`;
  
  return {
    title: metaTitle,
    description,
    openGraph: {
      type,
      locale: "en_US",
      url,
      title: metaTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      images: [image],
      creator: "@mathzai",
    },
    alternates: {
      canonical: url,
    },
  };
}