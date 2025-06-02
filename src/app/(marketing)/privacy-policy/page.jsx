import PrivacyPolicy from "@/components/marketing/privacyPolicy";

export const metadata = {
    title: "Mathz AI Privacy Policy – Your Data, Our Commitment",
    description: "Learn how Mathz AI protects your privacy and data. Read our privacy policy to understand how we handle information securely and responsibly.",
    alternates: {
        canonical: "/privacy-policy",
    },
    openGraph: {
        title: "Mathz AI Privacy Policy – Your Data, Our Commitment",
        description: "Learn how Mathz AI protects your privacy and data. Read our privacy policy to understand how we handle information securely and responsibly.",
        url: "https://www.mathzai.com/privacy-policy",
        type: "website",
    },
};

const PrivacyPolicyPage = () => {
    return (
        <PrivacyPolicy />
    );
};

export default PrivacyPolicyPage;
