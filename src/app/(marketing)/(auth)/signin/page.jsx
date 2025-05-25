import { AuthFlow } from "@/components/auth";

export const metadata = {
    title: 'Sign In - Mathz AI',
    description: 'Sign in to Mathz AI to elevate your math learning.',
};

export default function LoginPage() {
    return <AuthFlow initialStep="signIn" />;
}