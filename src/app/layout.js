import '@/styles/tailwind.css';
import '../styles/index.css';
import '../styles/fonts.css';
import { fontSans, fontMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { Providers } from './providers';
import ToasterContext from '@/components/shared/ToasterContext';
import Script from 'next/script';

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'math', 'AI tutor', 'step-by-step math', 'homework help',
    'algebra', 'geometry', 'calculus', 'real-time tutoring',
  ],
  authors: [{ name: 'Mathz AI', url: 'https://mathzai.com' }],
  creator: 'Mathz AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@mathzai',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content={process.env.GOOGLE_SEARCH_CONSOLE_ID} />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
        />
        <Script
          id="ga-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', ${process.env.GOOGLE_ANALYTICS_ID}, {
                page_path: window.location.pathname,
              });
            `,
          }}
        />  

        {/* ✅ Razorpay Checkout */}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />

        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
          <ToasterContext />
        </Providers>
      </body>
    </html>
  );
}