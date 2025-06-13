"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    User, Trash2, ChevronRight, Loader2, AlertTriangle, RotateCcw, Save, Edit3,
    UploadCloud, CheckCircle, Calendar, ShieldAlert, Sparkles,
    BookOpen, Mail, Briefcase, GraduationCap, BarChart3, Target, Globe,
    DollarSign,
    Bolt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger, AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import {
    useActiveSubscriptionQuery, useUpdateProfileImageMutation, useUpdateProfileMutation,
    useUserProfileDetailsQuery, useUpcomingSubscriptionsQuery, useDeleteAccountMutation,
    useDeleteProfileImageMutation,
} from "@/store/slices/profile";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useS3Asset } from "@/hooks/useS3Asset";
import toast from "react-hot-toast";
import { countryList, SUBSCRIPTION_FEATURES } from "@/config/constant";
import { capitalizeName } from "@/lib/utils";

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
};

const AnimatedContentLoader = React.memo(({ isLoading, error, onRetry, children, className }) => {
    const effectiveClassName = className || "min-h-[300px]";
    if (isLoading) {
        return (
            <motion.div
                className={`flex flex-col items-center justify-center h-full text-muted-foreground mx-auto ${effectiveClassName}`}
                variants={itemVariants} initial="hidden" animate="visible" exit="exit"
            >
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                <p className="text-lg font-medium">Loading content...</p>
            </motion.div >
        );
    }
    if (error) {
        return (
            <motion.div
                className={`flex flex-col items-center justify-center h-full text-red-600 bg-red-50 p-6 rounded-lg ${effectiveClassName}`}
                variants={itemVariants} initial="hidden" animate="visible" exit="exit"
            >
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="text-lg font-semibold mb-2">Oops! Something went wrong.</p>
                <p className="text-sm text-center mb-4">{error.message || "Failed to load data."}</p>
                {
                    onRetry && (
                        <Button onClick={onRetry} variant="outline" className="border-red-600 text-red-600 hover:bg-red-100">
                            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                        </Button>
                    )
                }
            </motion.div >
        );
    }
    return <motion.div variants={itemVariants} initial="hidden" animate="visible" exit="exit">{children}</motion.div>;
});

AnimatedContentLoader.displayName = "AnimatedContentLoader";

const ProfileSectionContent = React.memo(() => {
    const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfileDetailsQuery();
    const [updateProfileMutation, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [updateImageMutation, { isLoading: isUpdatingImage }] = useUpdateProfileImageMutation();
    const [deleteImageMutation, { isLoading: isDeletingImage }] = useDeleteProfileImageMutation();
    const { data: session, update: updateSession } = useSession();
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [openCountryPopover, setOpenCountryPopover] = useState(false);

    const initialAboutDetails = useMemo(() => ({
        full_name: "",
        email: "",
        grade: "",
        journey_level: "",
        purpose: "",
        country: "U.S.A",
    }), []);
    const [editedAboutDetails, setEditedAboutDetails] = useState(initialAboutDetails);

    const profileSubTabs = useMemo(() => ["About", "Subscription", "Delete Account"], []);
    const [activeProfileSubTab, setActiveProfileSubTab] = useState("About");

    const grades = useMemo(() => ["Elementary School", "Middle School", "High School", "College", "Graduate School", "Not Applicable"], []);
    const journeyLevelOptions = useMemo(() => ['Emerging', 'Intermediate', 'Advanced', 'Pro'], []);
    const purposeOptions = useMemo(() => ['Homework Help', 'Study with AI Tutor', 'Check your solution'], []);

    const profileImageKey = useMemo(() => profile?.data?.profile_picture ?? null, [profile?.data?.profile_picture]);
    const { url: profileImageUrl, isLoading: isLoadingProfileImage } = useS3Asset(profileImageKey);

    useEffect(() => {
        if (isEditingAbout) {
            return;
        }
        if (profile?.data) {
            setEditedAboutDetails({
                full_name: profile.data.full_name || "",
                email: profile.data.email || "",
                grade: profile.data.grade || "",
                journey_level: profile.data.journey_level || "",
                purpose: profile.data.purpose || "",
                country: profile.data.country || "U.S.A",
            });
        } else if (!profileLoading && !profile?.data) {
            setEditedAboutDetails(initialAboutDetails);
        }
    }, [profile?.data, profileLoading, isEditingAbout, initialAboutDetails]);

    useEffect(() => {
        if (profile?.data && session?.user) {
            const RDP = profile.data; const SUP = session.user;
            const updatesForSessionUser = {}; let needsSessionUpdate = false;
            if (SUP.profile_picture !== RDP.profile_picture) { updatesForSessionUser.profile_picture = RDP.profile_picture; needsSessionUpdate = true; }
            if (SUP.full_name !== RDP.full_name) { updatesForSessionUser.full_name = RDP.full_name; needsSessionUpdate = true; }
            if (SUP.username !== RDP.username) { updatesForSessionUser.username = RDP.username; needsSessionUpdate = true; }
            if (needsSessionUpdate) {
                const newSessionUser = { ...SUP, ...updatesForSessionUser };
                updateSession({ user: newSessionUser }).catch(err => console.error("Session update failed:", err));
            }
        }
    }, [profile?.data, session?.user, updateSession]);

    const { data: activeSub } = useActiveSubscriptionQuery();
    const subscriptionIcons = useMemo(() => ({
        free: '/images/icons/free-plan.gif',
        pro: '/images/icons/pro-plan.gif',
        premium: '/images/icons/premium-plan.gif',
        none: DollarSign
    }), []);

    const currentPlanIconDetails = useMemo(() => {
        const planType = activeSub?.data?.plan_type?.toLowerCase() || 'none';
        const iconData = subscriptionIcons[planType];
        if (typeof iconData === 'string') {
            return { type: 'gif', src: iconData };
        }
        const IconComponent = iconData || DollarSign;
        return { type: 'lucide', Component: IconComponent };
    }, [activeSub?.data?.plan_type, subscriptionIcons]);


    const handleAboutSave = useCallback(async () => {
        const toastId = toast.loading("Updating profile...");
        try {
            const payload = {
                full_name: editedAboutDetails.full_name,
                grade: editedAboutDetails.grade,
                journey_level: editedAboutDetails.journey_level,
                purpose: editedAboutDetails.purpose,
                country: editedAboutDetails.country,
            };
            await updateProfileMutation(payload).unwrap();
            toast.success("Profile details updated successfully!", { id: toastId });
            setIsEditingAbout(false);
            refetchProfile();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update profile details.", { id: toastId });
        }
    }, [editedAboutDetails, updateProfileMutation, refetchProfile]);

    const handleAboutInputChange = useCallback((field, value) => setEditedAboutDetails(prev => ({ ...prev, [field]: value })), []);
    const handleCountryChange = useCallback(value => { setEditedAboutDetails(prev => ({ ...prev, country: value })); setOpenCountryPopover(false); }, []);
    const handleAboutDiscard = useCallback(() => {
        if (profile?.data) setEditedAboutDetails({
            full_name: profile.data.full_name || "",
            email: profile.data.email || "",
            grade: profile.data.grade || "",
            journey_level: profile.data.journey_level || "",
            purpose: profile.data.purpose || "",
            country: profile.data.country || "U.S.A",
        });
        else setEditedAboutDetails(initialAboutDetails);
        setIsEditingAbout(false);
    }, [profile?.data, initialAboutDetails]);

    const handleImageUpload = useCallback(async (event) => {
        const file = event.target.files?.[0]; if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error("Image size should not exceed 5MB."); return; }
        const formData = new FormData(); const userId = profile?.data?.user_id || session?.user?.user_id;
        if (!userId) { toast.error("User ID not found."); return; }
        formData.append("type", `user_${userId}`); formData.append("files", file);
        const toastId = toast.loading("Uploading image...");
        try {
            const response = await fetch("/api/s3/upload", { method: "POST", body: formData });
            const result = await response.json();
            if (!response.ok || !result?.success || !result.files?.[0]?.fileKey) throw new Error(result?.message || "Upload failed");
            await updateImageMutation({ profile_image: result.files[0].fileKey }).unwrap();
            toast.success("Profile image updated!", { id: toastId });
            refetchProfile();
        } catch (error) { toast.error(error.message || "Failed to update profile image.", { id: toastId }); }
    }, [updateImageMutation, profile?.data?.user_id, session?.user?.user_id, refetchProfile]);

    const handleDeleteImage = useCallback(async () => {
        if (!profile?.data?.profile_picture) { toast.error("No profile image to delete."); return; }
        const toastId = toast.loading("Deleting image...");
        try {
            await deleteImageMutation().unwrap();
            toast.success("Profile image deleted!", { id: toastId });
            refetchProfile();
        }
        catch (error) { toast.error("Failed to delete profile image.", { id: toastId }); }
    }, [deleteImageMutation, profile?.data?.profile_picture, refetchProfile]);

    const renderInput = useCallback((name, label, type = 'text', placeholder, IconComponent, customHint = null) => {
        const value = editedAboutDetails[name] || '';
        const isDisabled = name === 'email' || (!isEditingAbout && name !== 'email');
        return (
            <motion.div className="w-full">
                <Label
                    htmlFor={name}
                    className="font-bold text-lg text-black"
                >
                    {label} {customHint && <span className="text-lg text-gray-600 font-normal">{customHint}</span>}
                </Label>
                <div className="relative w-full mt-1">
                    {IconComponent &&
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-10">
                            <IconComponent className="h-5 w-5" />
                        </div>}
                    <Input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={e => handleAboutInputChange(name, e.target.value)}
                        placeholder={placeholder}
                        disabled={isDisabled}
                        className={`w-full h-12 px-4 rounded-md border shadow-none placeholder:text-gray-600 ${IconComponent ? 'pl-10' : 'pl-4'} border-[#000000]/40 transition-colors duration-150 ease-in-out text-base ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                </div>
            </motion.div>
        );
    }, [editedAboutDetails, isEditingAbout, handleAboutInputChange]);

    const AboutTabDisplayContent = useCallback(() => {
        return (
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                    <div className="text-3xl font-bold mb-4 sm:mb-0">About Me</div>
                    {isEditingAbout ? (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleAboutSave}
                                size="sm"
                                variant="default"
                                disabled={isUpdatingProfile || isUpdatingImage || isDeletingImage}
                                className="shadow-none px-3 py-5 text-[16px] hover:bg-blue-700 flex items-center gap-2"
                            >
                                {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save
                            </Button>
                            <Button
                                onClick={handleAboutDiscard}
                                size="sm"
                                variant="outline"
                                className="shadow-none px-3 py-5 text-[16px]"
                                disabled={isUpdatingProfile || isUpdatingImage || isDeletingImage}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setIsEditingAbout(true)}
                            size="sm"
                            variant="outline"
                            className="shadow-none px-3 py-5 text-[16px] flex items-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit About
                        </Button>
                    )}
                </div>
                <div className="space-y-6 text-black pt-6">
                    <motion.div className="w-full">
                        <Label className="font-bold text-xl text-black">Profile Image</Label>
                        <div className="flex items-center gap-4 mt-2">
                            <Avatar className="w-20 h-20 border-2 border-gray-300">
                                {isLoadingProfileImage || profileLoading ? <Loader2 className="h-full w-full animate-spin text-purple-400" /> :
                                    profileImageUrl ? <AvatarImage src={profileImageUrl} alt={profile?.data?.full_name || ""} /> :
                                        <AvatarFallback className="text-2xl bg-gray-200 text-gray-600">
                                            {(profile?.data?.full_name?.split(" ")[0]?.[0] || "").toUpperCase()}{(profile?.data?.full_name?.split(" ")[1]?.[0] || "").toUpperCase() || <User />}
                                        </AvatarFallback>}
                            </Avatar>
                            {isEditingAbout && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <Button asChild size="sm" variant="outline" className="shadow-none" disabled={isUpdatingImage || isUpdatingProfile || isDeletingImage}>
                                        <Label htmlFor="upload-image-about" className="cursor-pointer flex items-center gap-2 px-3 py-2">
                                            {isUpdatingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                                            <span>Upload</span>
                                        </Label>
                                    </Button>
                                    <Input id="upload-image-about" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUpdatingImage || isUpdatingProfile || isDeletingImage} />
                                    {profileImageUrl &&
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={handleDeleteImage}
                                            className="shadow-none flex items-center gap-2 px-3 py-2"
                                            disabled={isDeletingImage || isUpdatingProfile || isUpdatingImage}
                                        >
                                            {isDeletingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            <span>Remove</span>
                                        </Button>
                                    }
                                </div>
                            )}
                        </div>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        {renderInput("full_name", "Full Name", "text", "Enter your full name", User)}
                        {renderInput("email", "Email", "email", "your.email@example.com", Mail)}
                        {/* {renderInput("phone_number", "Phone Number", "tel", "Enter your phone number", Phone)} */}
                        <motion.div className="w-full">
                            <Label
                                htmlFor="about_grade"
                                className="font-bold text-lg text-black"
                            >
                                Grade
                            </Label>
                            <div className="relative w-full mt-1">
                                <GraduationCap
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 z-10"
                                />
                                <Select
                                    value={editedAboutDetails.grade}
                                    onValueChange={v => handleAboutInputChange("grade", v)}
                                    disabled={!isEditingAbout}
                                >
                                    <SelectTrigger
                                        className={`w-full h-12 pl-10 rounded-md border shadow-none placeholder:text-gray-600 border-[#000000]/40 ${!isEditingAbout ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    >
                                        <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>
                        <motion.div className="w-full">
                            <Label htmlFor="about_journey_level" className="font-bold text-lg text-black">
                                Journey Level
                            </Label>
                            <div className="relative w-full mt-1">
                                <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 z-10" />
                                <Select
                                    value={editedAboutDetails.journey_level}
                                    onValueChange={(v) => handleAboutInputChange("journey_level", v)}
                                    disabled={!isEditingAbout}
                                >
                                    <SelectTrigger
                                        className={`w-full h-12 pl-10 rounded-md border shadow-none placeholder:text-gray-600 border-[#000000]/40 ${!isEditingAbout ? "bg-gray-100 cursor-not-allowed" : ""
                                            } ${editedAboutDetails.journey_level ? 'text-black' : 'text-gray-600'}`}
                                    >
                                        <SelectValue placeholder="Select journey level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {journeyLevelOptions.map((jl) => (
                                            <SelectItem key={jl} value={jl}>
                                                {jl}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>

                        <motion.div className="w-full">
                            <Label htmlFor="about_purpose" className="font-bold text-lg text-black">Purpose</Label>
                            <div className="relative w-full mt-1">
                                <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 z-10" />
                                <Select value={editedAboutDetails.purpose} onValueChange={v => handleAboutInputChange("purpose", v)} disabled={!isEditingAbout}>
                                    <SelectTrigger
                                        className={`w-full h-12 pl-10 rounded-md border shadow-none placeholder:text-gray-600 border-[#000000]/40 ${!isEditingAbout ? 'bg-gray-100 cursor-not-allowed' : ''} ${editedAboutDetails.purpose ? 'text-black' : 'text-gray-600'}`}
                                    >
                                        <SelectValue placeholder="Select purpose" />
                                    </SelectTrigger>
                                    <SelectContent>{purposeOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </motion.div>
                        <motion.div className="w-full">
                            <Label htmlFor="about_country" className="font-bold text-lg text-black">Country</Label>
                            <Popover open={openCountryPopover} onOpenChange={setOpenCountryPopover}>
                                <PopoverTrigger asChild disabled={!isEditingAbout}>
                                    <Button variant="outline" role="combobox" aria-expanded={openCountryPopover}
                                        className={`w-full h-12 justify-start text-left px-3 rounded-md border shadow-none border-[#000000]/40 text-base font-normal items-center ${!isEditingAbout
                                            ? 'bg-gray-100 cursor-not-allowed text-muted-foreground'
                                            : (editedAboutDetails.country ? 'text-black' : 'text-gray-600')
                                            }`}>
                                        <Globe className="h-5 w-5 text-gray-600 mr-2 shrink-0" />
                                        <span className="flex-grow truncate">
                                            {editedAboutDetails.country ? countryList.find(c => c.value === editedAboutDetails.country)?.label : "Select country..."}
                                        </span>
                                        <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search country..." className="h-9 placeholder:text-gray-600" />
                                        <CommandList>
                                            <CommandEmpty>No country found.</CommandEmpty>
                                            <CommandGroup>
                                                {countryList.map(c =>
                                                    <CommandItem key={c.value} value={c.label} onSelect={() => handleCountryChange(c.value)}>
                                                        {c.label}
                                                        <CheckCircle className={`ml-auto h-4 w-4 ${editedAboutDetails.country === c.value ? "opacity-100" : "opacity-0"}`} />
                                                    </CommandItem>)}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }, [
        profile?.data, profileLoading, isLoadingProfileImage, profileImageUrl, editedAboutDetails, isEditingAbout,
        isUpdatingProfile, isUpdatingImage, isDeletingImage,
        handleAboutSave, handleAboutDiscard, setIsEditingAbout, handleImageUpload, handleDeleteImage,
        renderInput, grades, journeyLevelOptions, purposeOptions, handleAboutInputChange, openCountryPopover, setOpenCountryPopover, handleCountryChange
    ]);

    const renderActiveTabContent = useCallback(() => {
        switch (activeProfileSubTab) {
            case "About": return <AboutTabDisplayContent />;
            case "Subscription": return <SubscriptionSectionContent />;
            case "Delete Account": return <DeleteAccountSectionContent />;
            default: return null;
        }
    }, [activeProfileSubTab, AboutTabDisplayContent]);

    const fullName = useMemo(() => profile?.data?.full_name || "", [profile?.data?.full_name]);
    const emailDisplay = useMemo(() => profile?.data?.email || "", [profile?.data?.email]);
    const countryDisplay = useMemo(() => {
        if (!profile?.data?.country) return null;
        return countryList.find(c => c.value === profile.data.country)?.label || profile.data.country;
    }, [profile?.data?.country]);

    return (
        <AnimatedContentLoader
            isLoading={profileLoading}
            error={profileError}
            onRetry={refetchProfile}
            className="min-h-[calc(100vh_-_10rem)]"
        >
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <motion.div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 md:p-8 text-white relative" variants={itemVariants}>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <motion.div className="relative group">
                            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-purple-400 shadow-lg rounded-lg">
                                {isLoadingProfileImage || profileLoading ? <Loader2 className="h-full w-full animate-spin text-purple-300" /> :
                                    profileImageUrl ? <AvatarImage src={profileImageUrl} alt={fullName} className="rounded-lg" /> :
                                        <AvatarFallback className="text-4xl bg-purple-500 text-white rounded-lg">{(fullName?.split(" ")[0]?.[0] || "").toUpperCase()}{(fullName?.split(" ")[1]?.[0] || "").toUpperCase() || <User />}</AvatarFallback>}
                            </Avatar>
                        </motion.div>
                        <div className="flex-grow text-center md:text-left mt-4 md:mt-0">
                            <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start">
                                {capitalizeName(fullName)}
                                {profile?.data?.is_verified && <CheckCircle className="w-5 h-5 ml-2 text-green-400" />}
                            </h1>
                            {emailDisplay && (
                                <p className="text-purple-200 flex items-center justify-center md:justify-start mt-1 text-sm md:text-base break-all">
                                    <Mail className="w-4 h-4 mr-1.5 shrink-0" /> {emailDisplay}
                                </p>
                            )}
                            {countryDisplay && (
                                <p className="text-purple-200 flex items-center justify-center md:justify-start mt-1 text-sm md:text-base">
                                    <Globe className="w-4 h-4 mr-1.5 shrink-0" /> {countryDisplay}
                                </p>
                            )}
                        </div>
                        <div className="md:ml-auto flex items-center justify-center md:justify-end pt-4 md:pt-0">
                            {currentPlanIconDetails.type === 'gif' ? (
                                <Image src={currentPlanIconDetails.src} alt="Current subscription plan" width={100} height={100} unoptimized className="bg-transparent rounded-full" />
                            ) : (
                                <currentPlanIconDetails.Component className="w-10 h-10 text-yellow-400" />
                            )}
                        </div>
                    </div>
                    <div className="mt-6 md:mt-8 flex items-center justify-between border-t border-purple-500/50 pt-4">
                        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1">
                            {profileSubTabs.map(tab => <Button key={tab} variant="ghost" size="sm" onClick={() => setActiveProfileSubTab(tab)} className={`px-3 py-1.5 text-sm sm:text-base rounded-md ${activeProfileSubTab === tab ? "bg-white/20 text-white font-semibold" : "text-purple-200 hover:bg-white/10 hover:text-white"}`}>{tab}</Button>)}
                        </div>
                    </div>
                </motion.div>
                <div className="p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeProfileSubTab} className="w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {renderActiveTabContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AnimatedContentLoader>
    )
});

ProfileSectionContent.displayName = "ProfileSectionContent";

const SubscriptionSectionContent = React.memo(() => {
    const { data: activeSub, isLoading: activeSubLoading, error: activeSubError, refetch: refetchActiveSub } = useActiveSubscriptionQuery();
    const { data: upcomingSubs, isLoading: upcomingSubsLoading, error: upcomingSubsError, refetch: refetchUpcomingSubs } = useUpcomingSubscriptionsQuery();
    const isLoading = activeSubLoading || upcomingSubsLoading; const error = activeSubError || upcomingSubsError;
    const refetchAll = useCallback(() => { refetchActiveSub(); refetchUpcomingSubs(); }, [refetchActiveSub, refetchUpcomingSubs]);
    const planIcons = useMemo(() => ({
        free: '/images/icons/free-plan.gif',
        pro: '/images/icons/pro-plan.gif',
        premium: '/images/icons/premium-plan.gif',
        default: DollarSign
    }), []);

    const SubscriptionInfoCard = useCallback(({ title, icon, children, bgColor = "bg-purple-600", textColor = "text-white", borderColor = "border-transparent", className = "" }) => {
        return (
            <motion.div variants={itemVariants} className={`rounded-xl shadow-lg overflow-hidden border ${borderColor} ${className}`}>
                <div className={`p-5 ${bgColor} ${textColor} flex items-center gap-4`}>
                    <h2 className="text-2xl font-bold">
                        {title}
                    </h2>
                </div>
                <div className="p-6 bg-white">{children}</div>
            </motion.div>
        );
    }, []);


    const PlanDetails = useCallback(({ sub, type }) => {
        if (!sub || !sub.plan_type || sub.plan_type === "NONE") {
            const IconComponent = planIcons.default;
            return <div className="text-center py-8 text-gray-500">
                <IconComponent className="w-10 h-10 mx-auto mb-3 opacity-60" />
                <p className="font-medium">No {type} subscription found.</p>
                {type === "active" && <Button asChild size="sm" className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"><Link href="/pricing-info">Explore Plans <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}
            </div>;
        }
        const planName = sub.plan_type.charAt(0).toUpperCase() + sub.plan_type.slice(1).toLowerCase();
        const features = SUBSCRIPTION_FEATURES[sub.plan_type.toLowerCase()] || [];
        const planIconData = planIcons[sub.plan_type.toLowerCase()] || planIcons.default;

        const PlanIconDisplay = typeof planIconData === 'string'
            ? <Image src={planIconData} alt={planName} width={40} height={40} className="mr-2 rounded-full" unoptimized />
            : <planIconData className="w-5 h-5 mr-2 text-purple-600" />;

        return (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <h3 className="text-xl font-semibold text-purple-700 flex items-center">
                        {PlanIconDisplay} {planName} Plan
                    </h3>
                    <span className="text-xl font-bold text-gray-800">${(sub.price / 100).toFixed(2)}<span className="text-xs text-gray-600">/{sub.interval}</span></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t pt-4 mt-4">
                    <div className="flex flex-col align-middle gap-1">
                        <p className="text-[14px] text-black uppercase font-medium">Status</p>
                        <div className="font-medium text-green-600 flex">
                            <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
                            {sub.status?.toUpperCase() || "ACTIVE"}
                        </div>
                    </div>
                    <div className="flex flex-col align-middle gap-1">
                        <p className="text-[14px] text-black uppercase font-medium">
                            {type === "active" ? "Active Since" : "Starts On"}
                        </p>
                        <p className="font-medium flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-gray-600" />
                            {new Date(sub.start_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex flex-col align-middle gap-1">
                        <p className="text-[14px] text-black uppercase font-medium">
                            {type === "active" ? "Renews/Expires On" : "Expires On"}
                        </p>
                        <p className="font-medium flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-gray-600" />
                            {new Date(sub.end_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                {features.length > 0 && (
                    <div className="pt-4 border-t flex flex-col gap-2">
                        <h4 className="text-[14px] text-black uppercase font-semibold">
                            Key Features:
                        </h4>
                        <ul className="space-y-1.5">
                            {features.slice(0, 5).map((feature, idx) => (
                                <li key={idx} className="flex items-start align-middle">
                                    <Bolt className="w-5 h-5 text-green-500 mr-1.5" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
                }
            </div>);
    }, [planIcons]);

    const activePlanCardIcon = activeSub?.data?.plan_type ? planIcons[activeSub.data.plan_type.toLowerCase()] || Sparkles : Sparkles;
    const upcomingPlanCardIcon = Calendar;


    return (
        <AnimatedContentLoader isLoading={isLoading} error={error} onRetry={refetchAll}>
            <div className="p-0 md:p-2">
                <div className="flex flex-col md:flex-row md:gap-6 space-y-8 md:space-y-0">
                    <SubscriptionInfoCard
                        title="Current Subscription"
                        icon={activePlanCardIcon}
                        bgColor="bg-gradient-to-r from-purple-600 to-indigo-600"
                        borderColor="border-purple-300"
                        className="md:w-3/5"
                    >
                        <PlanDetails sub={activeSub?.data} type="active" />
                    </SubscriptionInfoCard>

                    <SubscriptionInfoCard
                        title="Upcoming Subscriptions"
                        icon={upcomingPlanCardIcon}
                        bgColor="bg-gradient-to-r from-blue-500 to-teal-500"
                        borderColor="border-blue-300"
                        className="md:w-2/5"
                    >
                        {upcomingSubs?.data && Array.isArray(upcomingSubs.data) && upcomingSubs.data.length > 0 ?
                            <div className="space-y-6">
                                {upcomingSubs.data.map((subItem, index) => (
                                    <div key={index} className={index > 0 ? "pt-6 border-t border-gray-200" : ""}>
                                        <PlanDetails sub={subItem} type="upcoming" />
                                    </div>
                                ))}
                            </div>
                            :
                            (<div className="text-center py-8 text-gray-500">
                                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-60" />
                                <p className="font-medium">No upcoming subscriptions scheduled.</p>
                            </div>)
                        }
                    </SubscriptionInfoCard>
                </div>
            </div>
        </AnimatedContentLoader>
    )
});

SubscriptionSectionContent.displayName = "SubscriptionSectionContent";

const DeleteAccountSectionContent = React.memo(() => {
    const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
    const [isAccountDeleteSuccess, setIsAccountDeleteSuccess] = useState(false);

    const handleDelete = useCallback(async () => {
        try {
            await deleteAccount().unwrap();
            setIsAccountDeleteSuccess(true);
            toast.success("Account deletion process initiated. You will be signed out shortly.");
        }
        catch (err) {
            toast.error(err?.data?.message || "Failed to delete account.");
        }
    }, [deleteAccount]);

    useEffect(() => {
        let timer;
        if (isAccountDeleteSuccess) timer = setTimeout(() => { signOut({ callbackUrl: '/' }); }, 3000);
        return () => clearTimeout(timer);
    }, [isAccountDeleteSuccess]);

    return (
        <AnimatedContentLoader isLoading={isDeletingAccount && !isAccountDeleteSuccess} error={null}>
            <div className="rounded-md border-red-600 border-2">
                <div className="bg-red-600 text-white border-b border-red-700 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
                        <div>
                            <p className="text-xl sm:text-2xl font-bold">Delete Account</p>
                            <p className="text-red-100 opacity-95 text-xs sm:text-sm">This action is permanent and cannot be undone.</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 sm:p-6 bg-red-50 space-y-5">
                    <p className="text-sm sm:text-base text-red-800 font-semibold leading-relaxed">
                        Critical Warning: Deleting your account will permanently erase all associated data. This includes your profile, subscriptions, and any content you've created or saved. This action is irreversible.
                    </p>
                    <div>
                        <h3 className="text-sm sm:text-md font-semibold text-red-700 mb-2">
                            Consequences of Deletion:
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-red-700 pl-4 bg-white p-4 rounded-lg border border-red-300 shadow-sm">
                            <li>All personal information will be permanently erased.</li>
                            <li>Active subscriptions will be cancelled (refunds are subject to our terms of service).</li>
                            <li>You will lose access to all platform features and services immediately.</li>
                            <li>Your data cannot be recovered by you or our team once deleted.</li>
                        </ul>
                    </div>
                    <p className="text-xs sm:text-sm text-red-700">Please be absolutely sure before proceeding. If you have any active subscriptions, consider managing them before deleting your account.</p>
                </div>
                <div className="p-4 sm:p-6 bg-red-100 border-t border-red-300 flex justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                                disabled={isDeletingAccount}
                            >
                                {isDeletingAccount ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                I Understand, Delete My Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogOverlay
                            className="fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                        <AlertDialogContent className="bg-white border-gray-300 shadow-xl rounded-lg w-[90vw] max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg sm:text-xl text-gray-900 font-bold">
                                    Confirm Account Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription
                                    className="text-gray-700 pt-2 text-sm sm:text-base"
                                >
                                    This is your final confirmation. Are you absolutely sure you want to permanently delete your account? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto border-gray-400 text-gray-800 hover:bg-gray-100 px-4 py-2">Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                                    disabled={isDeletingAccount}
                                >
                                    {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Yes, Delete My Account</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AnimatedContentLoader>
    )
});

DeleteAccountSectionContent.displayName = "DeleteAccountSectionContent";

const UserProfilePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow overflow-y-auto py-6 sm:py-8">
                <div className="container mx-auto px-2 sm:px-4 h-full">
                    <ProfileSectionContent />
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;
