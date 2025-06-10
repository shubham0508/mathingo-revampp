import MathQuizComponent from '@/components/marketing/mathQuiz';
import Script from 'next/script';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: "Free Math Quiz – Test Your Skills with AI-Powered Learning | Mathz AI",
  description: "Take our interactive math quiz powered by AI. Get instant feedback, step-by-step solutions, and improve your problem-solving skills. Free math practice for all levels!",
  keywords: [
    'math quiz', 'free math test', 'AI math practice', 
    'interactive math problems', 'math skill assessment', 'online math quiz',
    'algebra quiz', 'geometry quiz', 'calculus practice'
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
    canonical: `${siteConfig.url}/math-quiz`,
  },
  openGraph: {
    title: "Free Math Quiz – Test Your Skills with AI-Powered Learning | Mathz AI",
    description: "Challenge yourself with our AI-driven math quiz. Get instant feedback, step-by-step solutions, and track your progress. Free for all skill levels!",
    url: `${siteConfig.url}/math-quiz`,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.url}/images/quiz-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Mathz AI Interactive Math Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mathzai",
    creator: "@mathzai",
    title: "Free Math Quiz – Test Your Skills with AI-Powered Learning",
    description: "Challenge yourself with our AI-driven math quiz. Get instant feedback and step-by-step solutions!",
    images: [`${siteConfig.url}/images/quiz-og.jpg`],
  },
};

const quizJsonLd = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  "name": "Mathz AI Interactive Math Quiz",
  "description": "Free interactive math quiz with AI-powered feedback and step-by-step solutions",
  "url": `${siteConfig.url}/math-quiz`,
  "provider": {
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url
  },
  "educationalLevel": ["Beginner", "Intermediate", "Advanced"],
  "educationalUse": "assessment",
  "learningResourceType": "quiz",
  "interactivityType": "active",
  "about": {
    "@type": "Thing",
    "name": "Mathematics"
  },
  "teaches": [
    "Algebra",
    "Geometry", 
    "Calculus",
    "Trigonometry",
    "Statistics"
  ]
};

const MathQuiz = () => {  
  return (
    <>
      <Script
        id="quiz-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quizJsonLd),
        }}
      />
      <MathQuizComponent />
    </>
  );
};

export default MathQuiz;