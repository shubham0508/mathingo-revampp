import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useS3Asset } from "@/hooks/useS3Asset";
import authApi from "@/lib/auth-api";
import { persistor } from "@/store";
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useMemo, useCallback } from "react";

const FALLBACK_AVATAR_URL = "https://github.com/shadcn.png";

export function NavUser({
  user = {
    full_name: "",
    email: "",
    profile_picture: "",
    plan_type: "free"
  },
}) {
  const { isMobile } = useSidebar();

  const userData = useMemo(() => ({
    fullName: user?.full_name || "",
    email: user?.email || "",
    planType: user?.plan_type || "free",
    profilePicture: user?.profile_picture || null,
  }), [user?.full_name, user?.email, user?.plan_type, user?.profile_picture]);

  const { url: profileImage } = useS3Asset(userData.profilePicture);

  const avatarSrc = useMemo(() =>
    profileImage || FALLBACK_AVATAR_URL,
    [profileImage]
  );

  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
      await persistor.purge();
      signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  const isPremiumUser = useMemo(() =>
    userData.planType === "premium",
    [userData.planType]
  );

  return (
    <SidebarMenu className="text-black dark:text-white">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-whiteText"
              aria-label={`User menu for ${userData.fullName}`}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={avatarSrc}
                  alt={`${userData.fullName}'s profile picture`}
                  loading="lazy"
                />
                <AvatarFallback>
                  <img
                    src={FALLBACK_AVATAR_URL}
                    alt="Default user avatar"
                    loading="lazy"
                  />
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold" title={userData.fullName}>
                  {userData.fullName}
                </span>
                <span className="truncate text-xs" title={userData.email}>
                  {userData.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" aria-hidden="true" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={avatarSrc}
                    alt={`${userData.fullName}'s profile picture`}
                    loading="lazy"
                  />
                  <AvatarFallback>
                    <img
                      src={FALLBACK_AVATAR_URL}
                      alt="Default user avatar"
                      loading="lazy"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold" title={userData.fullName}>
                    {userData.fullName}
                  </span>
                  <span className="truncate text-xs" title={userData.email}>
                    {userData.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {!isPremiumUser && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/pricing-info"
                      className="flex items-center gap-2 w-full"
                      title="Upgrade to premium plan"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      Upgrade Plan
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuRadioGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 w-full"
                  title="Manage your account settings"
                >
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 w-full"
                  title="Manage your subscription"
                >
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  Subscription
                </Link>
              </DropdownMenuItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer"
              title="Sign out of your account"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}