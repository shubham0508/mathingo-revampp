import { AuthFlow } from "@/components/auth";

export const metadata = {
    title: 'Sign Up - Mathz AI',
    description: 'Sign Up to Mathz AI to elevate your math learning.',
};

export default function SinupPage() {
    return <AuthFlow initialStep="signUpEmail" />;
}