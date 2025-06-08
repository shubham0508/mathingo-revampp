"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
    Eye,
    EyeOff,
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    useSendEmailMutation,
    useVerifyOTPMutation,
    useCreateUserMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} from '@/store/slices/authApi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { validateEmail, validateName, validateOtp, validatePassword } from '@/lib/validationUtils';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
            ease: 'easeOut'
        }
    })
};

const initialFormData = {
    email: '',
    password: '',
    name: '',
    otp: '',
    grade: '',
    mathJourney: '',
    purpose: '',
    country: 'U.S.A',
};

export function AuthFlow({
    initialStep = 'signIn',
    isPopup = false,
    onFlowComplete,
    allowForgotPassword = true,
    defaultCallbackUrl = "/homework-assistant",
    onClose
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentStep, setCurrentStep] = useState(initialStep);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(isPopup ? false : true);
    const [otpPurpose, setOtpPurpose] = useState(null);

    const [sendEmail, { isLoading: isSendingEmail }] = useSendEmailMutation();
    const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
    const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
    const [forgotPassword, { isLoading: isSendingForgotPasswordOTP }] = useForgotPasswordMutation();
    const [resetPasswordMutation, { isLoading: isResettingPassword }] = useResetPasswordMutation();

    const [isActionLoading, setIsActionLoading] = useState(false);

    const isLoading = isSendingEmail || isVerifyingOTP || isCreatingUser || isSendingForgotPasswordOTP || isResettingPassword || isActionLoading;

    useEffect(() => {
        if (isPopup) setIsDialogOpen(true);
    }, [isPopup]);

    useEffect(() => {
        setCurrentStep(initialStep);
    }, [initialStep]);


    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            const getErrorMessage = (err) => {
                switch (err) {
                    case "OAuthSignin": return "Error in OAuth Sign-in. Try again.";
                    case "OAuthCallback": return "Error in OAuth Callback.";
                    case "OAuthCreateAccount": return "Could not create account with provider. Try again.";
                    case "EmailCreateAccount": return "Could not create an account with email.";
                    case "Callback": return "Error in processing callback. Try again.";
                    case "OAuthAccountNotLinked": return "This email is already linked to another provider. Try signing in with that provider.";
                    case "CredentialsSignin": return "Invalid email or password.";
                    case "SessionRequired": return "You must be signed in to access this page.";
                    case "AccessDenied": return "Access denied. You may not have permission.";
                    case "Verification": return "Email verification failed or token expired.";
                    default: return "An unknown authentication error occurred. Please try again.";
                }
            };
            toast.error(getErrorMessage(error));
            router.replace(window.location.pathname, { shallow: true });
        }
    }, [searchParams, router]);

    const leftPaneContentMap = {
        signIn: { image: '/images/icons/img_ellipse_35.png', title: 'Interactive help when you need it.', subtitle: 'Learn Smarter, not harder' },
        signUpEmail: { image: '/images/icons/img_ellipse_35.png', title: 'Interactive help when you need it.', subtitle: 'Learn Smarter, not harder' },
        otp: { image: '/images/icons/img_ellipse_35.png', title: 'Interactive help when you need it.', subtitle: 'Learn Smarter, not harder' },
        quickSetup: { image: '/images/icons/img_ellipse_35.png', title: "Interactive help when you need it.", subtitle: 'Learn Smarter, not harder' },
        signUpDetails: { image: '/images/icons/img_ellipse_35.png', title: 'Interactive help when you need it.', subtitle: 'Learn Smarter, not harder' },
        forgotPasswordEmail: { image: '/images/icons/img_ellipse_35.png', title: 'Interactive help when you need it.', subtitle: "Learn Smarter, not harder" },
        resetPassword: { image: '/images/icons/img_ellipse_35.png', title: 'Interactive help when you need it.', subtitle: 'Learn Smarter, not harder' },
    };

    const currentLeftPane = leftPaneContentMap[currentStep] || leftPaneContentMap.signIn;

    const clearFormFields = (fieldsToClear = Object.keys(initialFormData)) => {
        const clearedData = {};
        fieldsToClear.forEach(field => {
            clearedData[field] = initialFormData[field];
        });
        setFormData(prev => ({ ...prev, ...clearedData }));
    };

    const resetAuthFlow = (targetStep = 'signIn') => {
        setCurrentStep(targetStep);
        setErrors({});
        setFormData(initialFormData);
        setOtpPurpose(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleOtpChange = (value) => {
        const sanitizedValue = value.slice(0, 6);
        setFormData(prev => ({ ...prev, otp: sanitizedValue }));
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: null }));
        }
    };

    const validateAndSetErrors = (fieldsToValidate) => {
        let isValid = true;
        const newErrors = {};

        fieldsToValidate.forEach(field => {
            const value = formData[field];
            let error = null;
            switch (field) {
                case 'email': error = validateEmail(value); break;
                case 'password': error = validatePassword(value); break;
                case 'name': error = validateName(value); break;
                case 'otp': error = validateOtp(value); break;
                case 'grade': error = !value ? `Grade is required.` : null; break;
                case 'mathJourney': error = !value ? `Math journey selection is required.` : null; break;
                case 'purpose': error = !value ? `Purpose is required.` : null; break;
                case 'country': error = !value ? `Country is required.` : null; break;
            }
            if (error) {
                isValid = false;
                newErrors[field] = error;
            }
        });
        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        if (!validateAndSetErrors(['email', 'password'])) return;

        setIsActionLoading(true);
        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error === "CredentialsSignin" ? "Invalid email or password." : (result.error || "Login failed. Please try again."));
            } else if (result?.ok) {
                toast.success("Successfully logged in!");
                if (onFlowComplete) onFlowComplete(formData);
                else router.push(defaultCallbackUrl);
                if (isPopup) setIsDialogOpen(false);
            } else {
                toast.error("Login failed. Please try again.");
            }
        } catch (error) {
            // Handle API error response format
            let errorMessage = "Something went wrong during sign in. Please try again.";

            if (error?.data?.error && Array.isArray(error.data.error) && error.data.error.length > 0) {
                errorMessage = error.data.error[0];
            } else if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.data?.detail) {
                errorMessage = error.data.detail;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        setIsActionLoading(true);
        signIn("google", { callbackUrl: defaultCallbackUrl })
            .catch((error) => {
                let errorMessage = "Google Sign-In failed. Please try again.";

                if (error?.data?.error && Array.isArray(error.data.error) && error.data.error.length > 0) {
                    errorMessage = error.data.error[0];
                } else if (error?.data?.message) {
                    errorMessage = error.data.message;
                } else if (error?.data?.detail) {
                    errorMessage = error.data.detail;
                } else if (error?.message) {
                    errorMessage = error.message;
                }

                toast.error(errorMessage);
            })
            .finally(() => setIsActionLoading(false));
    };

    const handleSignUpEmailSubmit = async (e) => {
        e.preventDefault();
        if (!validateAndSetErrors(['email'])) return;

        setIsActionLoading(true);
        try {
            const response = await sendEmail({ email: formData.email }).unwrap();

            // Check if response has errors even when status is success
            if (response?.error && Array.isArray(response.error) && response.error.length > 0) {
                const apiErrorMessage = response.error[0];
                if (apiErrorMessage.toLowerCase().includes("already exists")) {
                    toast.error("This email is already registered. Please sign in or use a different email.");
                } else {
                    toast.error(apiErrorMessage);
                }
                return;
            }

            toast.success("OTP sent to your email!");
            setOtpPurpose('signup');
            setCurrentStep('otp');
            clearFormFields(['otp', 'password', 'name', 'grade', 'mathJourney', 'purpose']);
        } catch (error) {
            // Handle network/server errors
            let apiErrorMessage = "Failed to send OTP. Please check the email and try again.";

            if (error?.data?.message) {
                apiErrorMessage = error.data.message;
            } else if (error?.data?.detail) {
                apiErrorMessage = error.data.detail;
            } else if (error?.message) {
                apiErrorMessage = error.message;
            }

            if (error.status === 409 || (typeof apiErrorMessage === 'string' && apiErrorMessage.toLowerCase().includes("already exists"))) {
                toast.error("This email is already registered. Please sign in or use a different email.");
            } else {
                toast.error(apiErrorMessage);
            }
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        if (!validateAndSetErrors(['otp'])) return;

        setIsActionLoading(true);
        try {
            const response = await verifyOTP({ email: formData.email, otp: formData.otp }).unwrap();

            // Check if response has errors even when status is success
            if (response?.error && Array.isArray(response.error) && response.error.length > 0) {
                const otpMsg = response.error[0];
                toast.error(otpMsg);
                setErrors(prev => ({ ...prev, otp: otpMsg }));
                return;
            }

            toast.success("OTP verified successfully!");
            clearFormFields(['otp']);

            if (otpPurpose === 'signup') {
                setCurrentStep('quickSetup');
            } else if (otpPurpose === 'forgotPassword') {
                setCurrentStep('resetPassword');
                clearFormFields(['password']);
            }
        } catch (otpError) {
            // Handle network/server errors
            let otpMsg = "Invalid OTP or it has expired. Please try again.";

            if (otpError?.data?.detail) {
                otpMsg = otpError.data.detail;
            } else if (otpError?.data?.message) {
                otpMsg = otpError.data.message;
            } else if (otpError?.message) {
                otpMsg = otpError.message;
            }

            toast.error(otpMsg);
            setErrors(prev => ({ ...prev, otp: otpMsg }));
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleQuickSetupSubmit = (e) => {
        e.preventDefault();
        const fieldsToValidate = ['mathJourney', 'purpose', 'country'].filter(field => formData[field]);

        try {
            // Validate only if not skipping
            if (e.target.id !== 'skip-onboarding-button') {
                if (!validateAndSetErrors(['mathJourney', 'purpose', 'country'])) return;
            } else {
                // For skip, only validate if fields have values, otherwise, clear their errors
                const newErrors = { ...errors };
                let needsValidation = false;
                ['mathJourney', 'purpose', 'country'].forEach(field => {
                    if (formData[field]) { // if field has a value even when skipping, it should be valid
                        needsValidation = true;
                    } else { // if field is empty and skipping, clear its error
                        newErrors[field] = null;
                    }
                });
                setErrors(newErrors);
                if (needsValidation && !validateAndSetErrors(fieldsToValidate)) return;
            }
            setCurrentStep('signUpDetails');
        } catch (error) {
            // Handle any unexpected errors during validation
            let errorMessage = "An error occurred during setup. Please try again.";

            if (error?.data?.error && Array.isArray(error.data.error) && error.data.error.length > 0) {
                errorMessage = error.data.error[0];
            } else if (error?.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        }
    };

    const handleFinalSignUpSubmit = async (e) => {
        e.preventDefault();
        if (!validateAndSetErrors(['grade', 'name', 'password'])) return;

        setIsActionLoading(true);
        try {
            const userData = {
                email: formData.email,
                full_name: formData.name,
                password: formData.password,
                username: formData.email,
                grade: formData.grade,
                level: formData.mathJourney || "",
                purpose: formData.purpose || "",
                country: formData.country || "",
            };
            const response = await createUser(userData).unwrap();

            // Check if response has errors even when status is success
            if (response?.error && Array.isArray(response.error) && response.error.length > 0) {
                toast.error(response.error[0]);
                return;
            }

            toast.success("Account created successfully! Logging you in...");

            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.ok) {
                toast.success("Logged in successfully!");
                if (onFlowComplete) onFlowComplete(formData);
                else router.push(defaultCallbackUrl);
                if (isPopup) setIsDialogOpen(false);
                resetAuthFlow();
            } else {
                toast.error(result?.error === "CredentialsSignin" ? "Login failed after signup. Please try logging in manually." : (result?.error || "Login failed after signup."));
                setCurrentStep('signIn');
            }
        } catch (userCreationError) {
            // Handle network/server errors
            let creationMsg = "Failed to create your account.";

            if (userCreationError?.data?.detail) {
                creationMsg = userCreationError.data.detail;
            } else if (userCreationError?.data?.message) {
                creationMsg = userCreationError.data.message;
            } else if (userCreationError?.message) {
                creationMsg = userCreationError.message;
            }

            toast.error(creationMsg);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!formData.email) {
            toast.error("Email address is missing.");
            return;
        }

        setIsActionLoading(true);
        try {
            let response;
            if (otpPurpose === 'signup') {
                response = await sendEmail({ email: formData.email }).unwrap();
            } else if (otpPurpose === 'forgotPassword') {
                response = await forgotPassword({ email: formData.email }).unwrap();
            }

            // Check if response has errors even when status is success
            if (response?.error && Array.isArray(response.error) && response.error.length > 0) {
                toast.error(response.error[0]);
                return;
            }

            toast.success("OTP resent to your email!");
        } catch (error) {
            // Handle network/server errors
            let apiErrorMessage = "Failed to resend OTP.";

            if (error?.data?.message) {
                apiErrorMessage = error.data.message;
            } else if (error?.data?.detail) {
                apiErrorMessage = error.data.detail;
            } else if (error?.message) {
                apiErrorMessage = error.message;
            }

            toast.error(apiErrorMessage);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleForgotPasswordEmailSubmit = async (e) => {
        e.preventDefault();
        if (!validateAndSetErrors(['email'])) return;

        setIsActionLoading(true);
        try {
            const response = await forgotPassword({ email: formData.email }).unwrap();

            // Check if response has errors even when status is success
            if (response?.error && Array.isArray(response.error) && response.error.length > 0) {
                toast.error(response.error[0]);
                return;
            }

            toast.success("Password reset OTP sent to your email!");
            setOtpPurpose('forgotPassword');
            setCurrentStep('otp');
            clearFormFields(['otp', 'password']);
        } catch (error) {
            // Handle network/server errors
            let apiErrorMessage = "Failed to send password reset OTP. Ensure the email is registered.";

            if (error?.data?.detail) {
                apiErrorMessage = error.data.detail;
            } else if (error?.data?.message) {
                apiErrorMessage = error.data.message;
            } else if (error?.message) {
                apiErrorMessage = error.message;
            }

            toast.error(apiErrorMessage);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validateAndSetErrors(['password'])) return;

        setIsActionLoading(true);
        try {
            await resetPasswordMutation({
                email: formData.email,
                otp: formData.otp,
                new_password: formData.password,
            }).unwrap();
            toast.success("Password has been reset successfully! Please sign in with your new password.");
            resetAuthFlow('signIn');
        } catch (error) {
            // Handle API error response format
            let apiErrorMessage = "Failed to reset password. Please try the process again.";

            if (error?.data?.error && Array.isArray(error.data.error) && error.data.error.length > 0) {
                apiErrorMessage = error.data.error[0];
            } else if (error?.data?.detail) {
                apiErrorMessage = error.data.detail;
            } else if (error?.data?.message) {
                apiErrorMessage = error.data.message;
            } else if (error?.message) {
                apiErrorMessage = error.message;
            }

            toast.error(apiErrorMessage);
        } finally {
            setIsActionLoading(false);
        }
    };

    const renderInput = (name, label, type = 'text', placeholder, customHint = null) => {
        return (
            <motion.div className="w-full" variants={fadeInUp}>
                <Label htmlFor={name} className="font-bold text-lg text-black">{label} {customHint && <span className="text-lg text-gray-600 font-normal">{customHint}</span>}</Label>
                <div className="relative w-full mt-1">
                    <Input
                        id={name}
                        name={name}
                        type={(type === 'password' && !showPassword) ? 'password' : 'text'}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full h-12 px-4 rounded-md border shadow-none
                                    ${errors[name] ? 'border-[#B80303] focus-visible:ring-[#B80303]' : 'border-[#000000]/40'}
                                    transition-colors duration-150 ease-in-out text-base
                        `}
                    />
                    {type === 'password' && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                    )}
                    {errors[name] && type !== 'password' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B80303]">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    )}
                </div>
                {errors[name] && <p className="text-lg text-[#B80303] mt-1">{errors[name]}</p>}
            </motion.div>
        );
    }

    const renderSignInForm = () => {
        const isSignInDisabled = !formData.email || !formData.password || !!errors.email || !!errors.password;
        return (
            <div className="flex flex-col items-center justify-center w-full">
                <form onSubmit={handleSignInSubmit} className="w-full max-w-[380px] space-y-6 flex flex-col">
                    <motion.h2 className="bg-gradient-secondary bg-clip-text !text-transparent font-roca text-4xl h-12 flex justify-center items-center" variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
                        Sign In
                    </motion.h2>
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
                        <Button variant="outline" className="w-full shadow-none py-3 text-base flex items-center justify-center gap-3 border-[#000000]/40 hover:bg-gray-100 h-12" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
                            <Image src="/images/icons/google-icon.png" alt="Google" width={20} height={20} />
                            Continue with Google
                        </Button>
                    </motion.div>
                    <motion.div className="flex flex-row justify-center items-center w-full gap-2 px-1" variants={fadeInUp} initial="hidden" animate="visible" custom={3}>
                        <Separator className="flex-1 bg-gray-300" />
                        <span className="text-sm font-roca text-[#000000]/70">or</span>
                        <Separator className="flex-1 bg-gray-300" />
                    </motion.div>
                    {renderInput('email', 'Email', 'email', 'Enter your email address')}
                    {renderInput('password', 'Password', 'password', 'Enter your password')}
                    {allowForgotPassword && (
                        <motion.div className="flex items-end justify-end -mt-2" variants={fadeInUp} initial="hidden" animate="visible" custom={4}>
                            <Button variant="link" type="button" className="p-0 h-auto text-[16px] text-[#000000]/70 hover:text-primary font-medium" onClick={() => { setErrors({}); setCurrentStep('forgotPasswordEmail'); clearFormFields(['password']); }}>
                                Forgot password?
                            </Button>
                        </motion.div>
                    )}
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={5}>
                        <Button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg rounded-md h-12" disabled={isLoading || isSignInDisabled}>
                            {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign In
                        </Button>
                    </motion.div>
                    <motion.p className="text-lg font-medium text-center text-black" variants={fadeInUp} initial="hidden" animate="visible" custom={6}>
                        Don't have an account?{' '}
                        <Button variant="link" type="button" className="p-0 h-auto text-primary hover:text-blue-700 font-medium text-lg" onClick={() => { setErrors({}); setCurrentStep('signUpEmail'); clearFormFields(['password']); }}>
                            Sign Up
                        </Button>
                    </motion.p>
                </form>
            </div>
        );
    };

    const renderSignUpEmailForm = () => {
        const isGetStartedDisabled = !formData.email || !!errors.email;
        return (
            <div className="flex flex-col items-center justify-center gap-10 w-full">
                <form onSubmit={handleSignUpEmailSubmit} className="w-full max-w-[380px] space-y-6 flex flex-col gap-2">
                    <motion.h2 className="bg-gradient-secondary bg-clip-text text-4xl !text-transparent font-roca h-12 flex justify-center items-center" variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
                        Sign Up
                    </motion.h2>
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
                        <Button variant="outline" className="w-full shadow-none py-3 text-base flex items-center justify-center gap-3 border-[#000000]/40 hover:bg-gray-100 h-12" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
                            <Image src="/images/icons/google-icon.png" alt="Google" width={20} height={20} />
                            Sign Up with Google
                        </Button>
                    </motion.div>
                    <motion.div className="flex flex-row justify-center items-center w-full gap-2 px-1" variants={fadeInUp} initial="hidden" animate="visible" custom={3}>
                        <Separator className="flex-1 bg-gray-300" />
                        <span className="text-sm font-roca text-[#000000]/70">or</span>
                        <Separator className="flex-1 bg-gray-300" />
                    </motion.div>
                    {renderInput('email', 'Email', 'email', 'example@email.com')}
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4}>
                        <Button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg rounded-md h-12" disabled={isLoading || isGetStartedDisabled}>
                            {isSendingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Get Started
                        </Button>
                    </motion.div>
                    <motion.p className="text-lg font-medium text-center text-black" variants={fadeInUp} initial="hidden" animate="visible" custom={5}>
                        Already have an account?{' '}
                        <Button variant="link" type="button" className="p-0 h-auto text-primary hover:text-blue-700 text-lg font-medium" onClick={() => { setErrors({}); setCurrentStep('signIn'); }}>
                            Log In
                        </Button>
                    </motion.p>
                </form>
            </div>
        );
    };

    const renderOtpForm = () => {
        const isOtpSubmitDisabled = !formData.otp || formData.otp.length !== 6 || !!errors.otp;
        let backStep = otpPurpose === 'signup' ? 'signUpEmail' : 'forgotPasswordEmail';

        return (
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-[380px] space-y-8 flex flex-col items-center text-center">
                    <div className="w-full relative flex items-center justify-center mb-3">
                        <motion.button
                            type="button"
                            onClick={() => {
                                setErrors({});
                                setCurrentStep(backStep);
                                clearFormFields(['otp']);
                                if (otpPurpose === 'signup') setOtpPurpose(null);
                            }}
                            className="absolute -left-20 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                            variants={fadeInUp} custom={0} initial="hidden" animate="visible"
                        >
                            <ArrowLeft className="h-5 w-5 text-black" />
                        </motion.button>
                    </div>

                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
                        <Image src="/images/icons/otp.png" alt="OTP" width={80} height={64} />
                    </motion.div>

                    <motion.p
                        className="text-lg text-center text-black font-medium mt-2 whitespace-nowrap overflow-x-auto"
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                    >
                        Enter the OTP sent to <span className="font-semibold">{formData.email || 'your email'}</span>
                    </motion.p>

                    <form onSubmit={handleOtpVerification} className="w-full space-y-6 flex flex-col items-center pt-3">
                        <motion.div className="flex justify-center" variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
                            <InputOTP
                                maxLength={6}
                                value={formData.otp || ''}
                                onChange={handleOtpChange}
                                autoFocus
                            >
                                <InputOTPGroup className="gap-2">
                                    {[...Array(6)].map((_, index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className={`w-12 h-12 text-center text-xl rounded-md border 
                                            ${errors.otp ? 'border-red-500 bg-[#FFF0F0]' : 'border-gray-300 focus:border-primary bg-white focus:ring-primary'}
                                            shadow-none`}
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </motion.div>
                        {errors.otp && 
                           <div className="flex flex-row align-middle justify-center gap-2 items-center text-[#B80303]">
                                <AlertCircle className="h-5 w-5" />
                                <p className="text-lg text-[#B80303]">{errors.otp}</p>
                            </div>
                        }
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            custom={2.5}
                            className="w-full pt-5"
                        >
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg rounded-md h-12"
                                disabled={isLoading || isOtpSubmitDisabled}
                            >
                                {isVerifyingOTP ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Verify OTP
                            </Button>
                        </motion.div>
                    </form>
                    <motion.p className="text-lg font-medium text-black pt-2" variants={fadeInUp} initial="hidden" animate="visible" custom={3}>
                        Didn't get the OTP?{' '}
                        <Button
                            variant="link"
                            type="button"
                            className="p-0 h-auto text-primary text-lg hover:text-blue-700 font-medium"
                            onClick={handleResendOtp}
                            disabled={isActionLoading || isSendingEmail || isSendingForgotPasswordOTP}
                        >
                            {(isActionLoading || isSendingEmail || isSendingForgotPasswordOTP) ? 'Sending...' : 'Send again'}
                        </Button>
                    </motion.p>
                </div>
            </div>
        );
    };

    const renderQuickSetupForm = () => {
        const options = {
            mathJourney: ['Emerging', 'Intermediate', 'Advanced', 'Pro'],
            purpose: ['Homework Help', 'Study with AI Tutor', 'Check your solution'],
        };
        const countryOptions = ["U.S.A", "Canada", "India", "U.K", "Australia", "Germany", "Singapore", "Other"];
        const isContinueDisabled = !(formData.mathJourney && formData.purpose && formData.country);

        return (
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-lg space-y-7 flex flex-col">
                    <div className="relative w-full">
                        <motion.button
                            type="button"
                            onClick={() => { setErrors({}); setCurrentStep('otp'); setOtpPurpose('signup'); }}
                            className="absolute -left-12 top-1 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                            variants={fadeInUp} custom={0} initial="hidden" animate="visible"
                        >
                            <ArrowLeft className="h-5 w-5 text-black" />
                        </motion.button>
                        <motion.h2 className="bg-gradient-secondary bg-clip-text text-2xl sm:text-3xl !text-transparent font-roca h-auto flex justify-center items-center text-center leading-tight" variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
                            Just a quick setup – <br className="sm:hidden" /> under a minute.
                        </motion.h2>
                    </div>
                    <motion.div className="text-center" variants={fadeInUp} initial="hidden" animate="visible" custom={1.5}>
                        <span className="text-xl text-black">In a rush? </span>
                        <Button
                            id="skip-onboarding-button"
                            variant="link"
                            type="button"
                            className="p-0 h-auto text-primary hover:text-blue-700 font-semibold text-xl"
                            onClick={(e) => {
                                setErrors({});
                                handleQuickSetupSubmit(e);
                            }}
                        >
                            Skip for now
                        </Button>
                    </motion.div>

                    <form onSubmit={handleQuickSetupSubmit} className="w-full space-y-6 flex flex-col">
                        {[
                            { key: 'mathJourney', label: 'Where are you in your math journey?', items: options.mathJourney, error: errors.mathJourney },
                            { key: 'purpose', label: 'What brings you to Mathz AI?', items: options.purpose, error: errors.purpose }
                        ].map((group, groupIndex) => (
                            <motion.div key={group.key} className="w-full" variants={fadeInUp} initial="hidden" animate="visible" custom={groupIndex + 2}>
                                <Label className="font-bold text-lg text-black">{group.label} {group.error && <AlertCircle className="inline h-4 w-4 ml-1 text-red-500" />}</Label>
                                <ToggleGroup type="single" variant="outline" value={formData[group.key] || undefined} onValueChange={(value) => { if (value) handleSelectChange(group.key, value); }} className="flex-wrap justify-start gap-2 mt-2">
                                    {group.items.map(item => (
                                        <ToggleGroupItem key={item} value={item} aria-label={item} className="shadow-none bg-[#ECEEFF] data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-[#d9e0ff] px-3 py-2 h-auto rounded-md text-[16px] border border-transparent data-[state=on]:border-primary">
                                            {item}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                                {group.error && <p className="text-lg text-red-500 mt-1">{group.error}</p>}
                            </motion.div>
                        ))}

                        <motion.div className="w-full" variants={fadeInUp} initial="hidden" animate="visible" custom={4}>
                            <Label htmlFor="country" className="font-bold text-lg text-black">Where are you joining from? {errors.country && <AlertCircle className="inline h-4 w-4 ml-1 text-red-500" />}</Label>
                            <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                                <SelectTrigger id="country" className={`w-full mt-2 px-4 rounded-md border ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-[#000000]/40'} font-medium text-[16px] text-black shadow-none h-12`}>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countryOptions.map(country => (<SelectItem key={country} value={country}>{country}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            {errors.country && <p className="text-lg text-red-500 mt-1">{errors.country}</p>}
                        </motion.div>

                        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={5} className="pt-2">
                            <Button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg rounded-md h-12 flex items-center justify-center" disabled={isLoading || isContinueDisabled}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </div>
        );
    };

    const renderSignUpDetailsForm = () => {
        const gradeOptions = ['Elementary', 'Middle/ High School', 'Undergraduate', 'Preparing for exams like SAT, GRE etc'];
        const isSubmitDisabled = !formData.grade || !formData.name || !formData.password || !!errors.grade || !!errors.name || !!errors.password;

        return (
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-[440px] space-y-6 flex flex-col items-center">
                    <div className="relative w-full">
                        <motion.button
                            type="button"
                            onClick={() => { setErrors({}); setCurrentStep('quickSetup'); }}
                            className="absolute -left-20 top-2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 focus:outline-none" variants={fadeInUp} custom={0} initial="hidden" animate="visible">
                            <ArrowLeft className="h-5 w-5 text-black" />
                        </motion.button>
                        <motion.h2 className="bg-gradient-secondary bg-clip-text text-4xl !text-transparent font-roca h-12" variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
                            Sign Up
                        </motion.h2>
                    </div>
                    <form onSubmit={handleFinalSignUpSubmit} className="w-full space-y-5 flex flex-col pt-5">
                        <motion.div className="w-full" variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
                            <Label className="font-bold text-lg text-black">Select your grade {errors.grade && <AlertCircle className="inline h-4 w-4 ml-1 text-red-500" />}</Label>
                            <ToggleGroup type="single" variant="outline" value={formData.grade || undefined} onValueChange={(value) => { if (value) handleSelectChange('grade', value); }} className="flex-wrap justify-start gap-2 mt-2">
                                {gradeOptions.map(item => (
                                    <ToggleGroupItem key={item} value={item} aria-label={item} className="shadow-none bg-[#ECEEFF] data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-[#d9e0ff] px-3 py-2 h-auto rounded-md text-[16px] border border-transparent data-[state=on]:border-primary">
                                        {item}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                            {errors.grade && <p className="text-lg text-red-500 mt-1">{errors.grade}</p>}
                        </motion.div>
                        {renderInput('name', 'Name', 'text', 'Enter your full name')}
                        {renderInput('password', 'Create Password', 'password', 'Create a strong password', "(Password should be at least 6 characters long)")}

                        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={5} className="pt-2">
                            <Button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg rounded-md h-12" disabled={isLoading || isSubmitDisabled}>
                                {isCreatingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Sign Up
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </div>
        );
    };

    const renderForgotPasswordEmailForm = () => {
        const isSubmitDisabled = !formData.email || !!errors.email;
        return (
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-[380px] space-y-8 flex flex-col items-center">
                    <div className="relative w-full">
                        <motion.button
                            type="button"
                            onClick={() => resetAuthFlow('signIn')}
                            className="absolute -left-20 top-1 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 focus:outline-none" variants={fadeInUp} custom={0} initial="hidden" animate="visible"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-700" />
                        </motion.button>
                        <motion.h2
                            className="bg-gradient-secondary bg-clip-text text-3xl sm:text-4xl !text-transparent font-roca h-12" variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
                            Forgot Password
                        </motion.h2>
                    </div>
                    <form onSubmit={handleForgotPasswordEmailSubmit} className="w-full space-y-6 flex flex-col">
                        {renderInput('email', 'Email', 'email', 'Enter your email address')}
                        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4} className="pt-2">
                            <Button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg rounded-md h-12" disabled={isLoading || isSubmitDisabled}>
                                {isSendingForgotPasswordOTP ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Send Reset Code
                            </Button>
                        </motion.div>
                    </form>
                    <motion.p className="text-lg text-center font-medium text-black" variants={fadeInUp} initial="hidden" animate="visible" custom={5}>
                        Remembered your password?{' '}
                        <Button variant="link" type="button" className="p-0 h-auto text-primary text-lg hover:text-blue-700 font-medium" onClick={() => { setErrors({}); setCurrentStep('signIn'); }}>
                            Sign In
                        </Button>
                    </motion.p>
                </div>
            </div>
        );
    };

    const renderResetPasswordForm = () => {
        const isSubmitDisabled = !formData.password || !!errors.password;
        return (
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-[380px] space-y-8 flex flex-col items-center">
                    <div className="relative w-full">
                        <motion.button
                            type="button"
                            onClick={() => { setErrors({}); setCurrentStep('otp'); setOtpPurpose('forgotPassword'); clearFormFields(['password']); }}
                            className="absolute -left-20 top-1 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 focus:outline-none" variants={fadeInUp} custom={0} initial="hidden" animate="visible">
                            <ArrowLeft className="h-5 w-5 text-black" />
                        </motion.button>
                        <motion.h2 className="bg-gradient-secondary bg-clip-text text-3xl sm:text-4xl !text-transparent font-roca h-12" variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
                            Reset Password
                        </motion.h2>
                    </div>
                    <motion.p
                        className="text-[16px] text-center text-black font-medium mt-2 whitespace-nowrap overflow-x-auto"
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                    >
                        Create a new password for <span className="font-semibold">{formData.email}</span>
                    </motion.p>
                    <form onSubmit={handleResetPasswordSubmit} className="w-full space-y-5 flex flex-col">
                        {renderInput('password', 'New Password', 'password', 'Enter new password', "(At least 6 characters)")}
                        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={4} className="pt-2">
                            <Button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg rounded-md h-12" disabled={isLoading || isSubmitDisabled}>
                                {isResettingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Update Password
                            </Button>
                        </motion.div>
                    </form>
                </div>
            </div>
        );
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'signIn': return renderSignInForm();
            case 'signUpEmail': return renderSignUpEmailForm();
            case 'otp': return renderOtpForm();
            case 'quickSetup': return renderQuickSetupForm();
            case 'signUpDetails': return renderSignUpDetailsForm();
            case 'forgotPasswordEmail': return renderForgotPasswordEmailForm();
            case 'resetPassword': return renderResetPasswordForm();
            default:
                setCurrentStep(initialStep); // Fallback to initialStep
                return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
        }
    };

    const AuthPageLayout = (
        <div className="flex w-full bg-white">
            <div className="hidden lg:flex w-1/2 bg-mathz-radial bg-cover bg-no-repeat flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute top-8 left-8 flex items-center z-10">
                    <div className='flex flex-col justify-center items-center text-center'>
                        <div className="flex gap-1.5 items-center">
                            <Link href="/">
                                <Image src="/images/icons/2.png" width={38} height={38} alt="Mathz AI Logo" />
                            </Link>
                            <h1 className="bg-gradient-secondary font-roca bg-clip-text text-3xl !text-transparent font-semibold">
                                Mathz AI
                            </h1>
                        </div>
                        <p className='font-medium text-sm text-black'>Elevate Math Learning</p>
                    </div>
                </div>
                <motion.div className="relative w-[280px] h-[280px] mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500 flex justify-center items-center p-1.5" style={{ boxShadow: '0 0 60px 15px rgba(0, 145, 255, 0.4)' }}>
                        <Image src={currentLeftPane.image} alt="MathzAI Tutor" width={270} height={270} className="object-contain rounded-full" />
                    </div>
                </motion.div>
                <motion.h2 className="text-[22px] font-semibold text-black text-center max-w-sm" variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
                    {currentLeftPane.title}
                </motion.h2>
                <motion.h2 className="text-[22px] font-semibold text-black text-center max-w-sm mt-3" variants={fadeInUp} initial="hidden" animate="visible" custom={2}>
                    {currentLeftPane.subtitle}
                </motion.h2>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
                {renderCurrentStep()}
            </div>
        </div>
    );

    const PopupLayout = (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
                setIsDialogOpen(open);
                onClose()
                if (!open) {
                    resetAuthFlow(initialStep);
                }
            }}
        >
            <DialogOverlay className="bg-black-opacity-90" />
            <DialogContent
                className="overflow-y-auto rounded-md h-[90vh] max-w-[1200px] w-[95vw] p-0"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="w-full flex flex-row p-0">
                    <div className="w-1/2 flex bg-mathz-radial bg-cover bg-no-repeat flex-col items-center justify-center text-black relative">
                        <div className="absolute top-6 left-6 flex z-10">
                            <div className='flex flex-col justify-center items-center text-center'>
                                <div className="flex gap-1.5 items-center">
                                    <Link href="/">
                                        <Image src="/images/icons/2.png" width={38} height={38} alt="Mathz AI Logo" />
                                    </Link>
                                    <h1 className="bg-gradient-secondary font-roca bg-clip-text text-2xl !text-transparent font-semibold">Mathz AI</h1>
                                </div>
                                <p className='font-medium text-xs text-black'>Elevate Math Learning</p>
                            </div>
                        </div>
                        <div className="text-center z-10">
                            <motion.div className="relative w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] mb-4 sm:mb-6 mx-auto" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500 flex justify-center items-center p-1" style={{ boxShadow: '0 0 40px 10px rgba(0, 145, 255, 0.3)' }}>
                                    <Image src={currentLeftPane.image || '/images/icons/img_ellipse_35.png'} alt="Auth Illustration" width={170} height={170} className="object-contain rounded-full" />
                                </div>
                            </motion.div>
                            <motion.h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-black" variants={fadeInUp} initial="hidden" animate="visible" custom={1}>{currentLeftPane.title}</motion.h2>
                            <motion.p className="text-lg sm:text-xl opacity-90 max-w-xs mx-auto text-black font-semibold" variants={fadeInUp} initial="hidden" animate="visible" custom={2}>{currentLeftPane.subtitle}</motion.p>
                        </div>
                    </div>
                    <div className="w-1/2 flex items-center justify-center bg-white">
                        {renderCurrentStep()}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    return isPopup ? PopupLayout : AuthPageLayout;
}