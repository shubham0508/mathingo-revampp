"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, Box, Gem, Sparkles, Star, Zap, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming path
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const Pricing = ({ status }) => {
    const router = useRouter();
    const [isQuarterly, setIsQuarterly] = useState(false);
    const [userCountry, setUserCountry] = useState("US");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCountry = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("https://ipapi.co/json/");
                if (!response.ok) throw new Error("Failed to fetch country");
                const data = await response.json();
                setUserCountry(data.country_code || "US"); // Use country_code for 'IN', 'US' etc.
            } catch (error) {
                console.error("Error fetching country:", error);
                setUserCountry("US"); // Fallback to US
            } finally {
                setIsLoading(false);
            }
        };
        fetchCountry();
    }, []);

    const handlePlanClick = (planTitle) => {
        if (planTitle === "Free" && status === "authenticated") return;

        const duration = isQuarterly ? "quarterly" : "monthly";
        const targetPath = status === "authenticated"
            ? `/checkout?plan=${encodeURIComponent(planTitle.toLowerCase())}&duration=${duration}`
            : `/signin?redirect=/checkout?plan=${encodeURIComponent(planTitle.toLowerCase())}&duration=${duration}`; // Redirect to checkout after signin

        router.push(targetPath);
    };

    const isIndia = useMemo(() => userCountry === "IN", [userCountry]);
    const currencySymbol = useMemo(() => (isIndia ? "₹" : "$"), [isIndia]);

    const pricingPlans = useMemo(() => [
        {
            id: "free",
            title: "Free",
            description: "Perfect to experience our basic features.",
            monthlyPrice: 0,
            quarterlyPricePerMonth: 0,
            monthlyPriceINR: 0,
            quarterlyPricePerMonthINR: 0,
            icon: <Zap className="h-7 w-7 text-blue-500" />,
            features: [
                "Unlimited Homework Assistant queries",
                "Unlimited Smart Solution Checks",
                "2 AI Math Tutor credits monthly",
            ],
            buttonLabel: "Start for Free",
            buttonVariant: "outline",
        },
        {
            id: "pro",
            title: "Pro",
            description: "For students who need regular math help.",
            monthlyPrice: 8.99,
            quarterlyPricePerMonth: 5.39,
            monthlyPriceINR: 899,
            quarterlyPricePerMonthINR: 539,
            icon: <Star className="h-7 w-7 text-yellow-500" />,
            features: [
                "Unlimited Homework Assistant queries",
                "Unlimited Smart Solution Checks",
                "40 AI Math Tutor credits monthly",
            ],
            buttonLabel: "Get Started",
            buttonVariant: "default",
        },
        {
            id: "premium",
            title: "Premium",
            description: "For serious learners needing unlimited support.",
            monthlyPrice: 18.99,
            quarterlyPricePerMonth: 11.39,
            monthlyPriceINR: 1599,
            quarterlyPricePerMonthINR: 959,
            icon: <Gem className="h-7 w-7 text-pink-500" />,
            isRecommended: true,
            features: [
                "Unlimited Homework Assistant queries",
                "Unlimited Smart Solution Checks",
                "Unlimited AI Math Tutor access",
                "Priority Support",
            ],
            buttonLabel: "Go Premium",
            buttonVariant: "default",
        },
    ], [isIndia]);

    const getDisplayPrice = (plan) => {
        const price = isQuarterly
            ? (isIndia ? plan.quarterlyPricePerMonthINR : plan.quarterlyPricePerMonth)
            : (isIndia ? plan.monthlyPriceINR : plan.monthlyPrice);
        return plan.title === "Free" ? "Free" : `${currencySymbol}${price.toFixed(2)}`;
    };

    const getOriginalMonthlyPrice = (plan) => {
        return isIndia ? plan.monthlyPriceINR : plan.monthlyPrice;
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: (i) => ({
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" }
        }),
    };

    const toggleVariants = {
        tap: { scale: 0.95 }
    };


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background text-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Loading pricing plans for your region...</p>
            </div>
        );
    }

    return (
        <>
            <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20 dark:from-black dark:to-gray-900/30 text-foreground">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <motion.div
                        className="text-center mb-12 md:mb-16"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                            Find the <span className="text-primary">Perfect Plan</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choose the best plan to supercharge your math learning journey with Mathz AI. All paid plans come with a 40% discount on quarterly billing!
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center mb-10 md:mb-14 relative"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex items-center space-x-3 p-2 bg-card dark:bg-slate-800 rounded-full shadow-md border border-border">
                            <Label htmlFor="billing-toggle" className={`text-sm sm:text-base font-medium cursor-pointer transition-colors ${!isQuarterly ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                                Monthly
                            </Label>
                            <motion.div variants={toggleVariants} whileTap="tap">
                                <Switch
                                    id="billing-toggle"
                                    checked={isQuarterly}
                                    onCheckedChange={setIsQuarterly}
                                    aria-label="Toggle billing period"
                                />
                            </motion.div>
                            <Label htmlFor="billing-toggle" className={`text-sm sm:text-base font-medium cursor-pointer transition-colors ${isQuarterly ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                                Quarterly
                            </Label>
                        </div>
                        {isQuarterly && (
                            <motion.div
                                className="absolute -bottom-8 sm:-bottom-5 left-1/2 -translate-x-1/2 mt-3 py-1.5 px-4 rounded-full text-sm font-semibold shadow-lg
                               bg-gradient-to-r from-green-500 to-teal-500 text-white
                               dark:from-green-600 dark:to-teal-600"
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            >
                                🎉 Save 40% with Quarterly Billing! 🎉
                            </motion.div>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {pricingPlans.map((plan, index) => {
                            const isDisabled = plan.title === "Free" && status === "authenticated";
                            const displayPrice = getDisplayPrice(plan);
                            const originalMonthlyPrice = getOriginalMonthlyPrice(plan);

                            return (
                                <motion.div
                                    key={plan.id}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className={`flex flex-col ${plan.isRecommended ? "lg:scale-105" : ""}`}
                                >
                                    <Card className={`h-full flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 ease-out relative overflow-hidden border-2
                    ${plan.isRecommended ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-border bg-card dark:bg-slate-800/70"}
                    ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                                    >
                                        {plan.isRecommended && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 transform bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-b-lg shadow-md">
                                                RECOMMENDED
                                            </div>
                                        )}
                                        <CardHeader className={`pt-10 pb-6 ${plan.isRecommended ? "pt-14" : ""}`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`p-2 rounded-full bg-card dark:bg-slate-700 shadow-inner ${plan.isRecommended ? "bg-primary/10 dark:bg-primary/20" : ""}`}>
                                                    {plan.icon}
                                                </div>
                                                <CardTitle className="text-2xl lg:text-3xl font-bold tracking-tight">{plan.title}</CardTitle>
                                            </div>
                                            <CardDescription className="text-sm lg:text-base text-muted-foreground min-h-[3em]">{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow space-y-3">
                                            <div className="mb-6 text-center">
                                                {isQuarterly && plan.title !== "Free" && (
                                                    <p className="text-base text-muted-foreground line-through">
                                                        {currencySymbol}{originalMonthlyPrice.toFixed(2)} /month
                                                    </p>
                                                )}
                                                <p className="text-4xl lg:text-5xl font-extrabold text-foreground dark:text-white">
                                                    {displayPrice}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {plan.title === "Free" ? "Always" : isQuarterly ? "per month, billed quarterly" : "per month, billed monthly"}
                                                </p>
                                            </div>
                                            <ul className="space-y-2.5">
                                                {plan.features.map((feature, key) => (
                                                    <li key={key} className="flex items-start">
                                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2.5 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm lg:text-base text-foreground/90 dark:text-slate-300">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter className="mt-auto pt-6 pb-8">
                                            <Button
                                                size="lg"
                                                className={`w-full py-3 text-base font-semibold rounded-lg shadow-md transition-transform duration-200 ease-out hover:scale-[1.02] focus:scale-[1.02] focus:ring-2 focus:ring-offset-2
                          ${plan.isRecommended ? "bg-primary hover:bg-blue-700 text-primary-foreground focus:ring-primary"
                                                        : plan.buttonVariant === "outline" ? "text-white bg-primary hover:bg-blue-700 focus:ring-primary dark:border-primary dark:text-primary dark:hover:bg-primary/20"
                                                            : "bg-foreground hover:bg-foreground/90 text-background focus:ring-foreground dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 dark:focus:ring-slate-300"}
                          ${isDisabled ? "opacity-50 !cursor-not-allowed hover:!scale-100" : ""}`}
                                                disabled={isDisabled}
                                                onClick={() => handlePlanClick(plan.title)}
                                                aria-label={`Get started with the ${plan.title} plan`}
                                            >
                                                {isDisabled ? "Current Plan" : plan.buttonLabel}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        className="mt-16 md:mt-20 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: pricingPlans.length * 0.1 + 0.2, duration: 0.6 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            Not Sure Which Plan is Right for You?
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                            Our team is here to help you choose the best Mathz AI plan to meet your learning goals. You can also start with our Free plan and upgrade anytime!
                        </p>
                        <Button size="xl" variant="ghost" asChild className="text-white hover:text-white bg-black text-lg font-semibold p-3 hover:bg-gray-900">
                            <Link href="/contact-us">
                                <Sparkles className="mr-2 h-5 w-5" /> Contact Support
                            </Link>
                        </Button>
                    </motion.div>

                </div>
            </section>
        </>
    );
};

export default Pricing;