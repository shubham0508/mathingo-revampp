import Pricing from '@/components/marketing/pricing';

export const metadata = {
  title: "Mathz AI Pricing – Choose the Best Plan for AI Math Learning",
  description: "Explore Mathz AI's pricing plans and find the perfect AI-powered math learning solution for you. Get step-by-step help, answer verification, and more!",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Mathz AI Pricing – Choose the Best Plan for AI Math Learning",
    description: "Explore Mathz AI's pricing plans and find the perfect AI-powered math learning solution for you. Get step-by-step help, answer verification, and more!",
    url: "https://www.mathzai.com/pricing",
    type: "website",
  },
};

const PricingPage = () => {  
  return (
    <Pricing status={"unauthenticated"} />
  )
}

export default PricingPage