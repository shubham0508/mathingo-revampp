"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    User, Trash2, ChevronRight, Loader2, AlertTriangle, RotateCcw, Save, Edit3,
    UploadCloud, LogOut, CheckCircle, Calendar, MapPin, ShieldAlert, Sparkles,
    BookOpen, Phone, Mail, Briefcase, GraduationCap, BarChart3, Target, Globe,
    Image as ImageIcon, Award, Star, DollarSign, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
};

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
            </motion.div>
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
                {onRetry && (
                    <Button onClick={onRetry} variant="outline" className="border-red-600 text-red-600 hover:bg-red-100">
                        <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                    </Button>
                )}
            </motion.div>
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
        username: "", email: "", phone_number: "", grade: "",
        mathJourney: "", purpose: "", country: "U.S.A",
    }), []);
    const [editedAboutDetails, setEditedAboutDetails] = useState(initialAboutDetails);

    const profileSubTabs = useMemo(() => ["About", "Subscription", "Delete Account"], []);
    const [activeProfileSubTab, setActiveProfileSubTab] = useState("About");

    const grades = useMemo(() => ["Elementary School", "Middle School", "High School", "College", "Graduate School", "Not Applicable"], []);
    const mathJourneyOptions = useMemo(() => ['Emerging', 'Intermediate', 'Advanced', 'Pro'], []);
    const purposeOptions = useMemo(() => ['Homework Help', 'Study with AI Tutor', 'Check your solution'], []);

    const profileImageKey = useMemo(() => profile?.data?.profile_picture ?? null, [profile?.data?.profile_picture]);
    const { url: profileImageUrl, isLoading: isLoadingProfileImage } = useS3Asset(profileImageKey);

    useEffect(() => {
        // Simplified console log for this effect
        // console.log("[Effect:SetEditedAboutDetails] Triggered. profileLoading:", profileLoading, "isEditingAbout:", isEditingAbout, "profile.data exists:", !!profile?.data);
        if (isEditingAbout) {
            // console.log("[Effect:SetEditedAboutDetails] Is editing, returning.");
            return;
        }
        if (profile?.data) {
            // console.log("[Effect:SetEditedAboutDetails] profile.data found, setting details:", profile.data);
            setEditedAboutDetails({
                username: profile.data.username || "",
                email: profile.data.email || "",
                phone_number: profile.data.phone_number || "",
                grade: profile.data.grade || "",
                mathJourney: profile.data.math_journey || "",
                purpose: profile.data.purpose || "",
                country: profile.data.country || "U.S.A",
            });
        } else if (!profileLoading && !profile?.data) {
            // console.log("[Effect:SetEditedAboutDetails] NOT profileLoading AND NO profile.data. Resetting to initial.");
            setEditedAboutDetails(initialAboutDetails);
        }
        // else {
        // console.log("[Effect:SetEditedAboutDetails] Conditions not met to set or reset. profile.data may be loading or undefined during load.");
        // }
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
    }, [profile?.data?.profile_picture, profile?.data?.full_name, profile?.data?.username, session?.user?.profile_picture, session?.user?.full_name, session?.user?.username, updateSession, profile?.data, session?.user]);

    const { data: activeSub } = useActiveSubscriptionQuery();
    const subscriptionIcons = useMemo(() => ({ free: Award, pro: Star, premium: Sparkles, none: DollarSign }), []);
    const CurrentSubscriptionIcon = useMemo(() => {
        const planType = activeSub?.data?.plan_type?.toLowerCase() || 'none';
        return subscriptionIcons[planType] || DollarSign;
    }, [activeSub?.data?.plan_type, subscriptionIcons]);

    const handleAboutSave = useCallback(async () => {
        try {
            const payload = { ...editedAboutDetails }; delete payload.email;
            await updateProfileMutation(payload).unwrap();
            toast.success("About details updated successfully!"); setIsEditingAbout(false);
        } catch (err) { toast.error(err?.data?.message || "Failed to update about details."); }
    }, [editedAboutDetails, updateProfileMutation]);

    const handleAboutInputChange = useCallback((field, value) => setEditedAboutDetails(prev => ({ ...prev, [field]: value })), []);
    const handleCountryChange = useCallback(value => { setEditedAboutDetails(prev => ({ ...prev, country: value })); setOpenCountryPopover(false); }, []);
    const handleAboutDiscard = useCallback(() => {
        if (profile?.data) setEditedAboutDetails({ username: profile.data.username || "", email: profile.data.email || "", phone_number: profile.data.phone_number || "", grade: profile.data.grade || "", mathJourney: profile.data.math_journey || "", purpose: profile.data.purpose || "", country: profile.data.country || "U.S.A" });
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
        } catch (error) { toast.error(error.message || "Failed to update profile image.", { id: toastId }); }
    }, [updateImageMutation, profile?.data?.user_id, session?.user?.user_id]);

    const handleDeleteImage = useCallback(async () => {
        if (!profile?.data?.profile_picture) { toast.error("No profile image to delete."); return; }
        const toastId = toast.loading("Deleting image...");
        try { await deleteImageMutation().unwrap(); toast.success("Profile image deleted!", { id: toastId }); }
        catch (error) { toast.error("Failed to delete profile image.", { id: toastId }); }
    }, [deleteImageMutation, profile?.data?.profile_picture]);

    const renderInput = useCallback((name, label, type = 'text', placeholder, IconComponent, customHint = null) => {
        const value = editedAboutDetails[name] || '';
        const isDisabled = (!isEditingAbout && name !== 'email') || name === 'email';
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
        // console.log("[AboutTabDisplayContent] Rendering. Props/State:", {
        //     profileLoading, isLoadingProfileImage, profileImageUrlExists: !!profileImageUrl,
        //     profileFullName: profile?.data?.full_name,
        //     editedUsername: editedAboutDetails.username,
        //     isEditingAbout
        // });

        return (
            <div>
                <div className="flex flex-row justify-between items-center">
                    <div className="text-3xl font-bold">About Me</div>
                    {isEditingAbout ? (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleAboutSave}
                                size="sm"
                                variant="default"
                                disabled={isUpdatingProfile || isUpdatingImage || isDeletingImage}
                                className="shadow-none px-3 py-5 text-[16px] hover:bg-blue-700 flex items-center gap-2" // Added flex, items-center, gap-2
                            >
                                <Save className="w-5 h-5" /> {/* Adjusted icon size */}
                                Save
                            </Button>
                            <Button
                                onClick={handleAboutDiscard}
                                size="sm"
                                variant="outline"
                                className="shadow-none px-3 py-5 text-[16px]"
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => setIsEditingAbout(true)}
                            size="sm"
                            variant="outline"
                            className="shadow-none px-3 py-5 text-[16px] flex items-center gap-2" // Added flex, items-center, gap-2
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit About
                        </Button>
                    )}
                </div>
                <div className="space-y-6 text-black pt-6">
                    <motion.div className="w-full">
                        <Label className="font-bold text-xl text-black">Profile Image</Label>
                        <div className="flex items-center gap-4 mt-2"> {/* Changed mt-1 to mt-2 */}
                            <Avatar className="w-20 h-20 border-2 border-gray-300">
                                {isLoadingProfileImage || profileLoading ? <Loader2 className="h-full w-full animate-spin text-purple-400" /> :
                                    profileImageUrl ? <AvatarImage src={profileImageUrl} alt={profile?.data?.full_name || ""} /> :
                                        <AvatarFallback className="text-2xl bg-gray-200 text-gray-600"> {/* Added text-gray-600 for fallback icon */}
                                            {(profile?.data?.full_name?.split(" ")[0]?.[0] || "").toUpperCase()}{(profile?.data?.full_name?.split(" ")[1]?.[0] || "").toUpperCase() || <User />}
                                        </AvatarFallback>}
                            </Avatar>
                            {isEditingAbout && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3"> {/* Changed flex-direction and gap */}
                                    <Button asChild size="sm" variant="outline" className="shadow-none" disabled={isUpdatingImage || isUpdatingProfile}>
                                        <Label htmlFor="upload-image-about" className="cursor-pointer flex items-center gap-2 px-3 py-2"> {/* Added gap, padding */}
                                            <UploadCloud className="w-4 h-4" />
                                            <span>Upload</span>
                                        </Label>
                                    </Button>
                                    <Input id="upload-image-about" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    {profileImageUrl &&
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={handleDeleteImage}
                                            className="shadow-none flex items-center gap-2 px-3 py-2" /* Added flex, items-center, gap, padding */
                                            disabled={isDeletingImage || isUpdatingProfile}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Remove</span>
                                        </Button>
                                    }
                                </div>
                            )}
                        </div>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        {renderInput("username", "Username", "text", "Enter your username", User)}
                        {renderInput("email", "Email", "email", "your.email@example.com", Mail)}
                        {renderInput("phone_number", "Phone Number", "tel", "Enter your phone number", Phone)}
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
                            <Label htmlFor="about_math_journey" className="font-bold text-lg text-black">
                                Math Journey
                            </Label>
                            <div className="relative w-full mt-1">
                                <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 z-10" />
                                <Select
                                    value={editedAboutDetails.mathJourney}
                                    onValueChange={(v) => handleAboutInputChange("mathJourney", v)}
                                    disabled={!isEditingAbout}
                                >
                                    <SelectTrigger
                                        className={`w-full h-12 pl-10 rounded-md border shadow-none placeholder:text-gray-600 border-[#000000]/40 ${!isEditingAbout ? "bg-gray-100 cursor-not-allowed" : ""
                                            } ${editedAboutDetails.mathJourney ? 'text-black' : 'text-gray-600'}`} // Ensure placeholder color if no value
                                    >
                                        <SelectValue placeholder="Select math journey" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mathJourneyOptions.map((mj) => (
                                            <SelectItem key={mj} value={mj}>
                                                {mj}
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
                                        className={`w-full h-12 pl-10 rounded-md border shadow-none placeholder:text-gray-600 border-[#000000]/40 ${!isEditingAbout ? 'bg-gray-100 cursor-not-allowed' : ''} ${editedAboutDetails.purpose ? 'text-black' : 'text-gray-600'}`} // Ensure placeholder color if no value
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
        profile?.data?.full_name, profileLoading, isLoadingProfileImage, profileImageUrl, editedAboutDetails, isEditingAbout,
        isUpdatingProfile, isUpdatingImage, isDeletingImage,
        handleAboutSave, handleAboutDiscard, setIsEditingAbout, handleImageUpload, handleDeleteImage,
        renderInput, grades, mathJourneyOptions, purposeOptions, handleAboutInputChange, openCountryPopover, setOpenCountryPopover, handleCountryChange
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
    const countryDisplay = useMemo(() => countryList.find(c => c.value === profile?.data?.country)?.label || profile?.data?.country || "Not specified", [profile?.data?.country]);

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
                            <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start">{fullName}{profile?.data?.is_verified && <CheckCircle className="w-5 h-5 ml-2 text-green-400" />}</h1>
                            <p className="text-purple-200 flex items-center justify-center md:justify-start mt-1"><Globe className="w-4 h-4 mr-1.5" /> {countryDisplay}</p>
                        </div>
                        <div className="md:ml-auto flex items-center justify-center md:justify-end pt-4 md:pt-0"><CurrentSubscriptionIcon className="w-10 h-10 text-yellow-400" /></div>
                    </div>
                    <div className="mt-6 md:mt-8 flex items-center justify-between border-t border-purple-500/50 pt-4">
                        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1">
                            {profileSubTabs.map(tab => <Button key={tab} variant="ghost" size="sm" onClick={() => setActiveProfileSubTab(tab)} className={`px-3 py-1.5 text-base rounded-md ${activeProfileSubTab === tab ? "bg-white/20 text-white font-semibold" : "text-purple-200 hover:bg-white/10 hover:text-white"}`}>{tab}</Button>)}
                        </div>
                    </div>
                </motion.div>
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeProfileSubTab} className="w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {renderActiveTabContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AnimatedContentLoader>
    );
});
ProfileSectionContent.displayName = "ProfileSectionContent";

const SubscriptionSectionContent = React.memo(() => {
    const { data: activeSub, isLoading: activeSubLoading, error: activeSubError, refetch: refetchActiveSub } = useActiveSubscriptionQuery();
    const { data: upcomingSubs, isLoading: upcomingSubsLoading, error: upcomingSubsError, refetch: refetchUpcomingSubs } = useUpcomingSubscriptionsQuery();
    const isLoading = activeSubLoading || upcomingSubsLoading; const error = activeSubError || upcomingSubsError;
    const refetchAll = useCallback(() => { refetchActiveSub(); refetchUpcomingSubs(); }, [refetchActiveSub, refetchUpcomingSubs]);
    const planIcons = useMemo(() => ({ free: Award, pro: Star, premium: Sparkles, default: DollarSign }), []);

    const SubscriptionInfoCard = useCallback(({ title, icon: Icon, children, bgColor = "bg-purple-600", textColor = "text-white", borderColor = "border-transparent", className = "" }) => (
        <motion.div variants={itemVariants} className={`rounded-xl shadow-lg overflow-hidden border ${borderColor} ${className}`}>
            <div className={`p-5 ${bgColor} ${textColor} flex items-center gap-4`}><div className="p-2.5 bg-white/25 rounded-lg"><Icon className="w-7 h-7" /></div><div><h2 className="text-xl font-bold">{title}</h2></div></div>
            <div className="p-6 bg-white">{children}</div>
        </motion.div>
    ), []);

    const PlanDetails = useCallback(({ sub, type }) => {
        if (!sub || !sub.plan_type || sub.plan_type === "NONE") {
            const PlanIcon = planIcons.default;
            return <div className="text-center py-8 text-gray-500"><PlanIcon className="w-10 h-10 mx-auto mb-3 opacity-60" /><p className="font-medium">No {type} subscription found.</p>{type === "active" && <Button asChild size="sm" className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"><Link href="/pricing-info">Explore Plans <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}</div>;
        }
        const planName = sub.plan_type.charAt(0).toUpperCase() + sub.plan_type.slice(1).toLowerCase();
        const features = SUBSCRIPTION_FEATURES[sub.plan_type.toLowerCase()] || [];
        const PlanIcon = planIcons[sub.plan_type.toLowerCase()] || planIcons.default;
        return (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2"><h3 className="text-lg font-semibold text-purple-700 flex items-center"><PlanIcon className="w-5 h-5 mr-2 text-purple-600" /> {planName} Plan</h3><span className="text-base font-bold text-gray-800">${(sub.price / 100).toFixed(2)}<span className="text-xs text-gray-500">/{sub.interval}</span></span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t pt-4 mt-4"><div><p className="text-xs text-gray-500 uppercase">Status</p><p className="font-medium text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />{sub.status?.toUpperCase() || "ACTIVE"}</p></div><div><p className="text-xs text-gray-500 uppercase">{type === "active" ? "Active Since" : "Starts On"}</p><p className="font-medium flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-gray-400" />{new Date(sub.start_date).toLocaleDateString()}</p></div><div className="sm:col-span-2"><p className="text-xs text-gray-500 uppercase">{type === "active" ? "Renews/Expires On" : "Expires On"}</p><p className="font-medium flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-gray-400" />{new Date(sub.end_date).toLocaleDateString()}</p></div></div>
                {features.length > 0 && <div className="pt-4 border-t"><h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Features:</h4><ul className="space-y-1.5">{features.slice(0, 5).map((feature, idx) => <li key={idx} className="flex items-start text-xs text-gray-600"><CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 mt-0.5 shrink-0" />{feature}</li>)}</ul></div>}
                {type === "active" && sub.plan_type !== "free" && sub.plan_type !== "NONE" && <Button variant="outline" className="w-full mt-4 border-purple-600 text-purple-700 hover:bg-purple-50 hover:text-purple-700">Manage Subscription</Button>}
            </div>);
    }, [planIcons]);

    return (
        <AnimatedContentLoader isLoading={isLoading} error={error} onRetry={refetchAll}>
            <div className="p-0 md:p-6"> {/* Adjusted padding for overall container */}
                <div className="flex flex-col md:flex-row md:gap-6 space-y-8 md:space-y-0">
                    <SubscriptionInfoCard
                        title="Current Subscription"
                        icon={Sparkles}
                        bgColor="bg-gradient-to-r from-purple-600 to-indigo-600"
                        borderColor="border-purple-300"
                        className="md:w-3/5" // 60% width on medium screens and up
                    >
                        <PlanDetails sub={activeSub?.data} type="active" />
                    </SubscriptionInfoCard>

                    <SubscriptionInfoCard
                        title="Upcoming Subscriptions"
                        icon={Calendar}
                        bgColor="bg-gradient-to-r from-blue-500 to-teal-500"
                        borderColor="border-blue-300"
                        className="md:w-2/5" // 40% width on medium screens and up
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
    );
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
        <AnimatedContentLoader isLoading={isDeletingAccount} error={null}>
            <div className="rounded-md border-red-600 border-2">
                <div className="bg-red-600 text-white border-b border-red-700 px-4 py-2">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8" />
                        <div>
                            <p className="text-2xl font-bold">Delete Account</p>
                            <p className="text-red-100 opacity-95">This action is permanent and cannot be undone.</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-red-50 space-y-5">
                    <p className="text-base text-red-800 font-semibold leading-relaxed">
                        Critical Warning: Deleting your account will permanently erase all associated data. This includes your profile, subscriptions, and any content you've created or saved. This action is irreversible.
                    </p>
                    <div>
                        <h3 className="text-md font-semibold text-red-700 mb-2">
                            Consequences of Deletion:
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-red-700 pl-4 bg-white p-4 rounded-lg border border-red-300 shadow-sm">
                            <li>All personal information will be permanently erased.</li>
                            <li>Active subscriptions will be cancelled (refunds are subject to our terms of service).</li>
                            <li>You will lose access to all platform features and services immediately.</li>
                            <li>Your data cannot be recovered by you or our team once deleted.</li>
                        </ul>
                    </div>
                    <p className="text-sm text-red-700">Please be absolutely sure before proceeding. If you have any active subscriptions, consider managing them before deleting your account.</p>
                </div>
                <div className="p-6 bg-red-100 border-t border-red-300 flex justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white text-base px-6 py-3">
                                <Trash2 className="w-5 h-5 mr-2" />
                                I Understand, Delete My Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogOverlay
                            className="fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" /> {/* Changed bg-black/60 to bg-black/80 */}
                        <AlertDialogContent className="bg-white border-gray-300 shadow-xl rounded-lg">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl text-gray-900 font-bold">
                                    Confirm Account Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription
                                    className="text-gray-700 pt-2"
                                >
                                    This is your final confirmation. Are you absolutely sure you want to permanently delete your account? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                                <AlertDialogCancel className="border-gray-400 text-gray-800 hover:bg-gray-100 px-4 py-2">Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                                    disabled={isDeletingAccount}
                                >
                                    {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Yes, Delete My Account</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AnimatedContentLoader>
    );
});

DeleteAccountSectionContent.displayName = "DeleteAccountSectionContent";

const UserProfilePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow overflow-y-auto py-8">
                <div className="container mx-auto px-4 h-full">
                    <ProfileSectionContent />
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;