import { siteConfig } from '@/config/site';

export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: siteConfig.logo,
  foundingDate: siteConfig.company.founded,
  sameAs: Object.values(siteConfig.links),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: siteConfig.company.email,
    availableLanguage: ['English'],
  },
});

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: createOrganizationSchema(),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});
