"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    useCreateOrderMutation,
    useVerifyPaymentMutation,
} from "@/store/slices/payment";
import {
    useActiveSubscriptionQuery,
    useUserProfileDetailsQuery,
} from "@/store/slices/profile";
import {
    AlertCircle, CheckCircle, CreditCard, Loader2, Ticket, XCircle,
    Mail, User, Phone, Globe, DollarSign,
    ChevronsUpDown, Check
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import { countryList, paymentPlans, RAZORPAY_KEY } from "@/config/constant";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const START_IMMEDIATELY = "start_immediately";
const START_AFTER_EXPIRY = "start_after_expiry";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const searchableCountries = countryList.filter(country => country.code !== "");

const UpgradeModal = ({ isOpen, onClose, onOptionSelect }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-card text-card-foreground rounded-xl shadow-2xl">
            <DialogHeader>
                <DialogTitle className="text-2xl font-roca text-foreground">Choose Upgrade Option</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                    Select when your Premium plan should activate.
                </DialogDescription>
            </DialogHeader>
            <motion.div
                className="flex flex-col gap-4 py-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <Button
                        variant="outline"
                        className="w-full bg-primaryButton hover:bg-primaryButtonHover text-white py-6 text-base font-semibold rounded-lg"
                        onClick={() => onOptionSelect(START_IMMEDIATELY)}
                    >
                        Start Premium Plan Today
                    </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Button
                        variant="outline"
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-base font-semibold rounded-lg"
                        onClick={() => onOptionSelect(START_AFTER_EXPIRY)}
                    >
                        Start After Current Plan Expires
                    </Button>
                </motion.div>
            </motion.div>
        </DialogContent>
    </Dialog>
);

const FormField = React.forwardRef(({ icon: IconComponent, id, label, error, children, required }, ref) => (
    <div className="space-y-1.5">
        <Label htmlFor={id} className="text-sm font-medium text-black flex items-center">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
        <div className="relative">
            {IconComponent && (
                <IconComponent
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10"
                    aria-hidden="true"
                />
            )}
            {children}
            {error && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
            )}
        </div>
        {error && <p className="text-xs text-red-500 pt-0.5">{error}</p>}
    </div>
));
FormField.displayName = "FormField";


const NewStyledCheckoutForm = ({
    plan,
    handlePayment: onFormSubmit,
    userProfile,
    isProcessing,
    couponDetails: appliedCouponDetails,
    onCouponApply,
    onConfettiEffect
}) => {
    const [formData, setFormData] = useState({
        email: userProfile?.email || "",
        name: userProfile?.name || "",
        country: "US",
        mobileNumber: userProfile?.phone || "",
        couponCodeInput: ""
    });

    const [formErrors, setFormErrors] = useState({});
    const [formTouched, setFormTouched] = useState({});
    const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

    const planIcons = useMemo(() => ({
        free: '/images/icons/free-plan.gif',
        pro: '/images/icons/pro-plan.gif',
        premium: '/images/icons/premium-plan.gif',
        default: DollarSign
    }), []);

    const PlanIconDisplay = useMemo(() => {
        const planKey = plan?.title?.toLowerCase();
        const iconSrc = planIcons[planKey];
        if (iconSrc && typeof iconSrc === 'string') {
            return <img src={iconSrc} alt={`${plan.title} plan icon`} className="w-full h-full object-contain" />;
        }
        const IconComponent = planIcons.default;
        return <IconComponent size={28} className="text-primary" />;
    }, [plan, planIcons]);


    useEffect(() => {
        if (userProfile) {
            setFormData(prev => ({
                ...prev,
                email: userProfile.email || prev.email,
                name: userProfile.name || prev.name,
                mobileNumber: userProfile.phone || prev.mobileNumber,
            }));
        }
    }, [userProfile]);

    const validateField = (fieldName, value) => {
        let error = "";
        switch (fieldName) {
            case "name":
                if (!value.trim()) error = "Name is required.";
                break;
            case "email":
                if (!value.trim()) error = "Email is required.";
                else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid.";
                break;
            case "mobileNumber":
                if (!value.trim()) error = "Mobile number is required.";
                break;
            case "country":
                if (!value) error = "Country is required.";
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCountryChange = (countryCode) => {
        setFormData(prev => ({ ...prev, country: countryCode }));
        setFormTouched(prev => ({ ...prev, country: true }));
        const error = validateField("country", countryCode);
        if (error) {
            setFormErrors(prev => ({ ...prev, country: error }));
        } else {
            setFormErrors(prev => ({ ...prev, country: '' }));
        }
        setCountryPopoverOpen(false);
    };


    const handleBlur = (e) => {
        const { name, value } = e.target;
        setFormTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        if (error) {
            setFormErrors(prev => ({ ...prev, [name]: error }));
        } else {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCouponInputChange = (e) => {
        setFormData(prev => ({ ...prev, couponCodeInput: e.target.value }));
    };

    const handleApplyCouponClick = () => {
        if (!formData.couponCodeInput.trim()) {
            toast.error("Please enter a coupon code.");
            return;
        }
        onCouponApply(formData.couponCodeInput, () => {
            onConfettiEffect();
            toast.success(
                (t) => (
                    <div className="flex items-center">
                        <span>Coupon "{formData.couponCodeInput.toUpperCase()}" applied successfully!</span>
                    </div>
                ),
                { duration: 4000 }
            );
        });
    };

    const handleRemoveCouponClick = () => {
        onCouponApply(null);
        setFormData(prev => ({ ...prev, couponCodeInput: "" }));
    };

    const isFormValid = useMemo(() => {
        const requiredFields = ['name', 'email', 'mobileNumber', 'country'];
        for (const field of requiredFields) {
            if (!formData[field] || validateField(field, formData[field])) {
                return false;
            }
        }
        return Object.values(formErrors).every(error => !error);
    }, [formData, formErrors]);


    const handleSubmit = (e) => {
        e.preventDefault();

        let allTouched = {};
        const requiredFields = ['name', 'email', 'mobileNumber', 'country'];
        let currentFormErrors = {};
        let firstErrorField = null;

        requiredFields.forEach(field => {
            allTouched[field] = true;
            const error = validateField(field, formData[field]);
            if (error) {
                currentFormErrors[field] = error;
                if (!firstErrorField) firstErrorField = field;
            }
        });

        setFormTouched(prev => ({ ...prev, ...allTouched }));
        setFormErrors(prev => ({ ...prev, ...currentFormErrors }));

        if (Object.values(currentFormErrors).some(error => error)) {
            if (firstErrorField) {
                const fieldElement = document.getElementById(firstErrorField);
                fieldElement?.focus();
            }
            toast.error("Please correct the errors in the form.");
            return;
        }

        if (!plan || !isFormValid) return;

        const submissionData = {
            email: formData.email,
            name: formData.name,
            country: formData.country,
            mobileNumber: formData.mobileNumber,
            couponCode: appliedCouponDetails ? appliedCouponDetails.code : "",
        };
        onFormSubmit(submissionData);
    };

    const getPriceDetails = useCallback(() => {
        if (!plan) return { original: 0, discounted: 0, final: 0, discountApplied: 0, currency: "USD" };

        let finalPrice = plan.price;
        let discountApplied = 0;
        const currency = plan.currency || "USD";

        if (appliedCouponDetails) {
            if (appliedCouponDetails.discount) {
                discountApplied = plan.price * appliedCouponDetails.discount;
                finalPrice = plan.price - discountApplied;
            } else if (appliedCouponDetails.discountValue) {
                discountApplied = appliedCouponDetails.discountValue;
                finalPrice = Math.max(0, plan.price - discountApplied);
            }
        }
        return {
            original: plan.price,
            final: finalPrice,
            discountApplied,
            currency
        };
    }, [plan, appliedCouponDetails]);

    const priceDetails = getPriceDetails();

    if (!plan) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                <p className="ml-4 text-xl text-black">Loading plan details...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-white p-6 mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center mb-6 sm:mb-8">
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl font-bold text-black">
                    Checkout
                </motion.h1>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    <motion.div className="space-y-6" variants={itemVariants}>
                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl font-medium text-black mb-1">Billing Information</h2>
                            <div className="space-y-4">
                                <FormField label="Email address" id="email" icon={Mail} error={formTouched.email && formErrors.email} required>
                                    <Input
                                        type="email" name="email" id="email" placeholder="you@example.com"
                                        value={formData.email} onChange={handleChange} onBlur={handleBlur}
                                        className={`w-full h-12 text-sm rounded-md shadow-none pl-10 pr-10 
                                            ${formTouched.email && formErrors.email ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary focus:ring-1'}`}
                                    />
                                </FormField>
                                <FormField label="Full Name" id="name" icon={User} error={formTouched.name && formErrors.name} required>
                                    <Input
                                        type="text" name="name" id="name" placeholder="Your full name"
                                        value={formData.name} onChange={handleChange} onBlur={handleBlur}
                                        className={`w-full h-12 text-sm rounded-md shadow-none pl-10 pr-10
                                            ${formTouched.name && formErrors.name ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary focus:ring-1'}`}
                                    />
                                </FormField>

                                <FormField label="Mobile Number" id="mobileNumber" icon={Phone} error={formTouched.mobileNumber && formErrors.mobileNumber} required>
                                    <Input
                                        type="tel" name="mobileNumber" id="mobileNumber" placeholder="(555) 123-4567"
                                        value={formData.mobileNumber} onChange={handleChange} onBlur={handleBlur}
                                        className={`w-full h-12 text-sm rounded-md shadow-none pl-10 pr-10
                                            ${formTouched.mobileNumber && formErrors.mobileNumber ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary focus:ring-1'}`}
                                    />
                                </FormField>

                                <FormField label="Country" id="country" icon={Globe} error={formTouched.country && formErrors.country} required>
                                    <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={countryPopoverOpen}
                                                aria-label="Select country"
                                                id="country"
                                                className={`w-full h-12 text-sm rounded-md shadow-none pl-10 pr-3 justify-between font-normal hover:bg-transparent
                                                    ${formTouched.country && formErrors.country ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder:text-red-700' : 'border-gray-300 focus:border-primary focus:ring-primary focus:ring-1'}`}
                                                onClick={() => setCountryPopoverOpen(!countryPopoverOpen)}
                                            >
                                                <span className="truncate">
                                                    {formData.country
                                                        ? countryList.find((country) => country.code === formData.country)?.name
                                                        : "Select a Country"}
                                                </span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search country..." />
                                                <CommandList>
                                                    <CommandEmpty>No country found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {searchableCountries.map((country) => (
                                                            <CommandItem
                                                                key={country.code}
                                                                value={country.name}
                                                                onSelect={() => {
                                                                    handleCountryChange(country.code);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={`mr-2 h-4 w-4 ${formData.country === country.code ? "opacity-100" : "opacity-0"}`}
                                                                />
                                                                {country.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FormField>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div className="space-y-6" variants={itemVariants}>
                        <motion.div variants={itemVariants} className="p-5 rounded-lg shadow-lg border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>
                            <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-200">
                                <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center overflow-hidden">
                                    {PlanIconDisplay}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-black">{plan.title} Plan</h3>
                                    <p className="text-xs text-gray-600">
                                        {plan.selectedDuration ? `${plan.selectedDuration.charAt(0).toUpperCase() + plan.selectedDuration.slice(1)} Billing` : 'Selected Plan'}
                                    </p>
                                </div>
                                <p className="ml-auto font-semibold text-black">
                                    ${priceDetails.original.toFixed(2)}
                                </p>
                            </div>

                            <div className="space-y-1.5 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-black">${priceDetails.original.toFixed(2)}</span>
                                </div>
                                {appliedCouponDetails && priceDetails.discountApplied > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Discount ({appliedCouponDetails.code})</span>
                                        <span>-${priceDetails.discountApplied.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200 mt-2">
                                    <span className="text-black">Total</span>
                                    <span className="text-black">${priceDetails.final.toFixed(2)} {priceDetails.currency}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="couponCodeInput" className="text-sm font-medium text-black">Have a coupon?</Label>
                                {appliedCouponDetails ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between p-2.5 bg-green-50 border border-green-300 rounded-md"
                                    >
                                        <p className="text-sm text-green-700 flex items-center">
                                            <Ticket size={16} className="mr-1.5 flex-shrink-0" /> Coupon "{appliedCouponDetails.code}" applied!
                                        </p>
                                        <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 h-auto p-0 text-xs font-medium"
                                            onClick={handleRemoveCouponClick}
                                        >
                                            Remove
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            id="couponCodeInput"
                                            name="couponCodeInput"
                                            placeholder="Enter coupon"
                                            value={formData.couponCodeInput}
                                            onChange={handleCouponInputChange}
                                            className="border-gray-300 h-11 focus:border-primary focus:ring-1 focus:ring-primary rounded-md shadow-none text-sm flex-grow"
                                            disabled={!!appliedCouponDetails}
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleApplyCouponClick}
                                            variant="outline"
                                            className="border-primary text-primary hover:bg-primary/10 text-sm px-4 py-2 h-11 shadow-none shrink-0"
                                            disabled={!!appliedCouponDetails || !formData.couponCodeInput.trim() || isProcessing}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-primary hover:bg-blue-700 text-white py-3 text-base font-semibold rounded-lg shadow-md 
                                           transition-all duration-300 ease-in-out transform hover:scale-[1.02]
                                           disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={isProcessing || !isFormValid}
                            >
                                {isProcessing ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <CreditCard className="mr-2 h-5 w-5" />
                                )}
                                {isProcessing ? "Processing..." : `Proceed to Payment ($${priceDetails.final.toFixed(2)})`}
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </form>
        </motion.div>
    );
};

const PaymentStatusDisplay = ({ status, orderId, errorMsg, router, searchParams }) => {
    const statusConfig = {
        success: {
            icon: <CheckCircle className="h-20 w-20 md:h-24 md:w-24 mb-6 text-green-500" />,
            title: "Payment Successful!",
            description: "Your transaction is complete. Your plan is now active.",
            colorClass: "bg-green-500/10 border-green-500/30",
            textColor: "text-green-700",
        },
        error: {
            icon: <XCircle className="h-20 w-20 md:h-24 md:w-24 mb-6 text-red-500" />,
            title: "Payment Failed",
            description: errorMsg || "An error occurred while processing your payment.",
            colorClass: "bg-red-500/10 border-red-500/30",
            textColor: "text-red-700",
        },
        hold: {
            icon: <AlertCircle className="h-20 w-20 md:h-24 md:w-24 mb-6 text-yellow-500" />,
            title: "Action Required",
            description: errorMsg || "Your payment was successful, but we need a moment to update your profile.",
            colorClass: "bg-yellow-500/10 border-yellow-500/30",
            textColor: "text-yellow-700",
        },
    };

    const currentStatus = statusConfig[status] || statusConfig.error;

    return (
        <motion.div
            key="paymentStatus"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="flex justify-center items-center min-h-[calc(100vh-10rem)] p-4"
        >
            <motion.div
                className={`w-full max-w-lg p-6 md:p-10 rounded-2xl shadow-2xl border ${currentStatus.colorClass} bg-card`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        variants={itemVariants}
                        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {currentStatus.icon}
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-roca font-bold mb-3 text-foreground">
                        {currentStatus.title}
                    </motion.h2>
                    <motion.p variants={itemVariants} className={`text-base md:text-lg ${currentStatus.textColor} mb-6`}>
                        {currentStatus.description}
                    </motion.p>

                    {orderId && status !== 'error' && (
                        <motion.div variants={itemVariants} className="bg-background rounded-lg p-3 my-4 w-full max-w-sm text-left">
                            <p className="text-sm text-muted-foreground font-medium">
                                Order ID: <span className="text-foreground font-semibold">{orderId}</span>
                            </p>
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                        {status === "success" || status === "hold" ? (
                            <Button
                                onClick={() => router.push("/profile")}
                                className="w-full bg-primaryButton hover:bg-primaryButtonHover text-white py-3 text-lg"
                            >
                                Go to Profile
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={() => router.push("/pricing-info")}
                                    className="w-full bg-primaryButton hover:bg-primaryButtonHover text-white py-3 text-lg"
                                >
                                    Back to Pricing
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const planQuery = searchParams.get("plan");
                                        const durationQuery = searchParams.get("duration");
                                        router.replace(`/checkout?plan=${planQuery}&duration=${durationQuery}`);
                                    }}
                                    className="w-full py-3 text-lg"
                                >
                                    Try Again
                                </Button>
                            </>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ProcessingPaymentDisplay = ({ progress }) => (
    <motion.div
        key="processing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center space-y-8 p-4 min-h-[calc(100vh-10rem)]"
    >
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
            <Loader2 className="h-16 w-16 md:h-20 md:w-20 text-blue-600" />
        </motion.div>
        <motion.h3
            className="text-2xl md:text-3xl font-semibold font-roca text-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            Processing Your Payment
        </motion.h3>
        <Progress value={progress} className="w-full max-w-md h-3 rounded-full bg-muted" indicatorClassName="bg-blue-600" />
        <motion.p
            className="text-muted-foreground text-center max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            Just a moment... We're securely verifying your payment details.
        </motion.p>
    </motion.div>
);

const Checkout = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, update: updateSession } = useSession();
    const userProfile = session?.user;

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [isProcessingState, setIsProcessingState] = useState(false);
    const [progress, setProgress] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [couponDetails, setCouponDetails] = useState(null);
    const [paymentInitialized, setPaymentInitialized] = useState(false);

    const [createOrder, {
        data: checkoutOrder,
        error: createOrderError,
        isLoading: isCreatingOrder,
    }] = useCreateOrderMutation();

    const [verifyPayment, {
        data: verifyPaymentData,
        isLoading: isVerifyingPayment,
        error: verifyPaymentError
    }] = useVerifyPaymentMutation();

    const {
        refetch: refetchProfile
    } = useUserProfileDetailsQuery();

    const {
        data: activeSubscription
    } = useActiveSubscriptionQuery();

    useEffect(() => {
        const planTitle = searchParams.get("plan");
        const duration = searchParams.get("duration") || "monthly";

        if (!planTitle) {
            setApiError("No payment plan selected.");
            setPaymentStatus("error");
            toast.error("No payment plan selected.");
            router.replace("/pricing-info");
            return;
        }

        const foundPlan = paymentPlans.find(
            (item) => item.title.toLowerCase() === planTitle.toLowerCase()
        );

        if (!foundPlan) {
            setApiError(`Invalid payment plan: ${planTitle}.`);
            setPaymentStatus("error");
            toast.error(`Invalid payment plan: ${planTitle}.`);
            router.replace("/pricing-info");
            return;
        }

        const planDetails = {
            ...foundPlan,
            price: duration === "monthly" ? foundPlan.monthlyPrice : foundPlan.annualPrice,
            selectedDuration: duration
        };

        setSelectedPlan(planDetails);
        setPaymentStatus(null);
        setOrderId(null);
        setIsProcessingState(false);
    }, [searchParams, router]);

    const combinedIsProcessing = isCreatingOrder || isVerifyingPayment || isProcessingState;

    useEffect(() => {
        if (createOrderError) {
            setPaymentStatus("error");
            setApiError(createOrderError?.data?.message || "Failed to create payment order.");
            setIsProcessingState(false);
            toast.error(createOrderError?.data?.message || "Failed to create payment order.");
        }
    }, [createOrderError]);

    useEffect(() => {
        if (verifyPaymentError) {
            setPaymentStatus("error");
            setApiError(verifyPaymentError?.data?.message || "Payment verification failed.");
            setIsProcessingState(false);
            toast.error(verifyPaymentError?.data?.message || "Payment verification failed.");
        }
    }, [verifyPaymentError]);

    const updateSessionAndProfile = useCallback(async () => {
        setIsProcessingState(true);
        setProgress(95);
        try {
            const { data: freshProfile } = await refetchProfile();

            if (freshProfile && session) {
                await updateSession({
                    user: {
                        ...session.user,
                        ...freshProfile,
                    },
                });
            }
            setProgress(100);
            setPaymentStatus("success");
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 7000);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setPaymentStatus("hold");
            setApiError("Payment successful, but profile update failed. Please check your account or contact support.");
            toast.error("Profile update failed. Please check your account.");
        } finally {
            setIsProcessingState(false);
        }
    }, [session, updateSession, refetchProfile]);

    useEffect(() => {
        if (isVerifyingPayment) {
            setProgress(0);
            setIsProcessingState(true);
            const timer = setInterval(() => {
                setProgress((prev) => {
                    const newProgress = prev + Math.random() * 10 + 5;
                    return newProgress >= 90 ? 90 : newProgress;
                });
            }, 200);

            return () => clearInterval(timer);
        } else if (verifyPaymentData && paymentStatus === null && !isProcessingState) {
            updateSessionAndProfile();
        }
    }, [isVerifyingPayment, verifyPaymentData, updateSessionAndProfile, paymentStatus, isProcessingState]);

    const initializeRazorpay = useCallback(async (orderIdToPay, amount) => {
        if (!window.Razorpay || !RAZORPAY_KEY) {
            setPaymentStatus("error");
            setApiError("Payment gateway not available.");
            setIsProcessingState(false);
            toast.error("Payment service unavailable.");
            return;
        }

        setOrderId(orderIdToPay);

        const options = {
            key: RAZORPAY_KEY,
            amount: Math.round(amount * 100),
            currency: "USD",
            name: "GLOBAL Education",
            description: `${selectedPlan.title} - ${selectedPlan.selectedDuration} Plan`,
            order_id: orderIdToPay,
            handler: function (response) {
                setProgress(10);
                setIsProcessingState(true);
                verifyPayment({
                    order_id: response.razorpay_order_id,
                    payment_id: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    plan: selectedPlan.title.toLowerCase(),
                    interval: selectedPlan.selectedDuration,
                    coupon_code: couponDetails?.code,
                }).unwrap().catch(() => {
                    setIsProcessingState(false);
                });
            },
            modal: {
                escape: false,
                ondismiss: function () {
                    if (!isVerifyingPayment && paymentStatus === null) {
                        setPaymentStatus("error");
                        setApiError("Payment was cancelled or closed.");
                        toast.error("Payment cancelled.");
                        setIsProcessingState(false);
                    }
                },
            },
            prefill: {
                name: paymentDetails?.name || userProfile?.name || "",
                email: paymentDetails?.email || userProfile?.email || "",
                contact: paymentDetails?.mobileNumber || userProfile?.phone || "",
            },
            theme: {
                color: "#2563EB"
            }
        };

        try {
            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.on("payment.failed", function (response) {
                setPaymentStatus("error");
                setApiError(response.error.description || "Payment failed on Razorpay.");
                toast.error(response.error.reason || "Payment failed.");
                setIsProcessingState(false);
            });
            razorpayInstance.open();
        } catch (err) {
            setPaymentStatus("error");
            setApiError("Failed to initialize payment gateway.");
            setIsProcessingState(false);
            toast.error("Payment initialization failed.");
        }
    }, [selectedPlan, paymentDetails, userProfile, verifyPayment, couponDetails, isVerifyingPayment, paymentStatus]);

    useEffect(() => {
        if (checkoutOrder?.data?.order_id?.order_id &&
            selectedPlan &&
            !isCreatingOrder &&
            !isVerifyingPayment &&
            paymentStatus === null &&
            !paymentInitialized) {

            let amountToPay = selectedPlan.price;
            if (couponDetails) {
                if (couponDetails.discount) {
                    amountToPay = selectedPlan.price * (1 - couponDetails.discount);
                } else if (couponDetails.discountValue) {
                    amountToPay = Math.max(0, selectedPlan.price - couponDetails.discountValue);
                }
            }
            setPaymentInitialized(true);
            initializeRazorpay(checkoutOrder.data.order_id.order_id, amountToPay);
        }
    }, [checkoutOrder, selectedPlan, initializeRazorpay, couponDetails, isCreatingOrder, isVerifyingPayment, paymentStatus, paymentInitialized]);


    const handleUpgradeOption = (option) => {
        setShowUpgradeModal(false);
        setIsProcessingState(true);
        setPaymentInitialized(false);
        createOrder({
            plan: selectedPlan.title.toLowerCase(),
            duration: selectedPlan.selectedDuration,
            plan_upgrade: true,
            upgrade_option: option,
            coupon_code: couponDetails?.code,
        }).unwrap().catch(() => {
            setIsProcessingState(false);
        });
    };

    const handlePaymentSubmit = (checkoutFormData) => {
        setPaymentDetails(checkoutFormData);
        setIsProcessingState(true);
        setPaymentStatus(null);
        setPaymentInitialized(false);

        const isUpgradingToPremium =
            userProfile?.plan_type === "pro" &&
            selectedPlan?.title.toLowerCase() === "premium" &&
            activeSubscription;

        if (isUpgradingToPremium) {
            setShowUpgradeModal(true);
        } else {
            createOrder({
                plan: selectedPlan.title.toLowerCase(),
                duration: selectedPlan.selectedDuration,
                plan_upgrade: false,
                upgrade_option: "null",
                coupon_code: couponDetails?.code,
            }).unwrap().catch(() => {
                setIsProcessingState(false);
            });
        }
    };
    const handleCouponApplication = (couponCodeInput, onSuccessCallback) => {
        if (couponCodeInput === null) {
            setCouponDetails(null);
            toast.success("Coupon removed.");
            return;
        }

        if (!couponCodeInput.trim()) {
            toast.error("Please enter a coupon code.");
            return;
        }

        const upperCaseCoupon = couponCodeInput.toUpperCase();
        if (upperCaseCoupon === "SAVE20") {
            setCouponDetails({ code: "SAVE20", discount: 0.20 });
            if (onSuccessCallback) onSuccessCallback();
        } else if (upperCaseCoupon === "FLAT5") {
            setCouponDetails({ code: "FLAT5", discountValue: 5 });
            if (onSuccessCallback) onSuccessCallback();
        } else {
            toast.error("Invalid coupon code.");
            setCouponDetails(null);
        }
    };


    if (!selectedPlan && paymentStatus !== "error") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            </div>
        );
    }

    const handleConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12 antialiased">
                {showConfetti && (
                    <ReactConfetti
                        width={typeof window !== 'undefined' ? window.innerWidth : 0}
                        height={typeof window !== 'undefined' ? window.innerHeight : 0}
                        recycle={false}
                        numberOfPieces={300}
                        gravity={0.12}
                        tweenDuration={7000}
                    />
                )}

                <AnimatePresence mode="wait">
                    {combinedIsProcessing && paymentStatus === null ? (
                        <ProcessingPaymentDisplay progress={progress} />
                    ) : paymentStatus !== null ? (
                        <PaymentStatusDisplay
                            status={paymentStatus}
                            orderId={orderId}
                            errorMsg={apiError}
                            router={router}
                            searchParams={searchParams}
                        />
                    ) : selectedPlan ? (
                        <motion.div
                            key="checkoutForm"
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0 }}
                        >
                            <NewStyledCheckoutForm
                                plan={selectedPlan}
                                handlePayment={handlePaymentSubmit}
                                userProfile={userProfile}
                                isProcessing={combinedIsProcessing}
                                couponDetails={couponDetails}
                                onCouponApply={handleCouponApplication}
                                onConfettiEffect={handleConfetti}
                            />
                            <UpgradeModal
                                isOpen={showUpgradeModal}
                                onClose={() => {
                                    setShowUpgradeModal(false);
                                    if (!isCreatingOrder && !checkoutOrder && !isProcessingState && !orderId) {
                                        setIsProcessingState(false);
                                    } else if (!isCreatingOrder && !checkoutOrder && isProcessingState && !orderId) {
                                        setIsProcessingState(false);
                                    }
                                }}
                                onOptionSelect={handleUpgradeOption}
                            />
                        </motion.div>
                    ) : (
                        <div className="flex justify-center items-center min-h-screen">
                            <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                            <p className="ml-4 text-xl text-black">Preparing checkout...</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Checkout;