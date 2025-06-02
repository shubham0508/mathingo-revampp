import TermsOfService from "@/components/marketing/termsOfService";

export const metadata = {
  title: "Mathz AI Privacy Policy – Your Data, Our Commitment",
  description: "Learn how Mathz AI protects your privacy and data. Read our privacy policy to understand how we handle information securely and responsibly.",
  alternates: {
    canonical: "/terms-of-service",
  },
  openGraph: {
    title: "Mathz AI Privacy Policy – Your Data, Our Commitment",
    description: "Learn how Mathz AI protects your privacy and data. Read our privacy policy to understand how we handle information securely and responsibly.",
    url: "https://www.mathzai.com/terms-of-service",
    type: "website",
  },
};

const TermsOfServicePage = () => {
  return (
    <TermsOfService />
  );
};

export default TermsOfServicePage;
