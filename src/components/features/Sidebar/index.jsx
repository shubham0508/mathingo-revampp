'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';
import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';
import { NavUser } from './nav-user';
import { useSession } from 'next-auth/react';

const menuItems = [
  {
    title: 'Homework Assistant',
    iconSrc: '/images/icons/notebook-pen.png',
    alt: 'Homework Assistant Icon',
    href: '/homework-assistant',
  },
  {
    title: 'AI Math Tutor',
    iconSrc: '/images/icons/math_tutor.png',
    alt: 'AI Math Tutor Icon',
    href: '/ai-math-tutor',
  },
  {
    title: 'Smart Solution Check',
    iconSrc: '/images/icons/computer.png',
    alt: 'Smart Solution Check Icon',
    href: '/solution-check',
  },
  {
    title: 'Blogs',
    iconSrc: '/images/icons/blog.png',
    alt: 'Blogs Icon',
    href: '/blogs',
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isGuest = useMemo(() => {
    if (!session || !session.user || Object.keys(session.user).length === 0) {
      return true;
    }
    return session.user.isGuest ?? false;
  }, [session]);

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  useEffect(() => {
    const shouldCollapse = pathname.includes('/select-questions');

    if (shouldCollapse) {
      if (shouldCollapse && state !== 'collapsed') {
        toggleSidebar(false);
      } else if (!shouldCollapse && state !== 'expanded') {
        toggleSidebar(true);
      }
    }

  }, [pathname, state, toggleSidebar]);

  const logoSize = useMemo(() => ({
    width: isCollapsed ? 32 : 44,
    height: isCollapsed ? 32 : 44,
  }), [isCollapsed]);

  return (
    <nav aria-label="Main Sidebar Navigation" role="navigation">
      <Sidebar side="left" className="h-screen" collapsible="icon">
        <SidebarContent className="mt-8">
          <div
            className={`flex ${isCollapsed ? 'justify-center items-center px-1 ml-1' : 'flex-row gap-1.5 px-4'}`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1.5 align-middle justify-center">
                  <Link
                    href="/"
                    aria-label="Go to Mathz AI Homepage"
                    title="Mathz AI - AI-Powered Math Learning Platform"
                  >
                    <Image
                      src="/images/icons/2.png"
                      width={logoSize.width}
                      height={logoSize.height}
                      alt="Mathz AI Logo - AI-Powered Math Learning Platform"
                      priority
                      sizes={isCollapsed ? "32px" : "44px"}
                    />
                  </Link>
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-black text-white">
                  Mathz AI
                </TooltipContent>
              )}
            </Tooltip>
            {!isCollapsed && (
              <div className="flex flex-row align-middle justify-center items-center gap-4">
                <h1 className="bg-gradient-secondary font-roca bg-clip-text text2xl !text-transparent font-semibold">
                  Mathz AI
                </h1>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      className="hover:bg-white rounded-full p-1 transition-colors duration-200 cursor-pointer"
                      onClick={handleToggleSidebar}
                      aria-label="Collapse sidebar"
                      type="button"
                    >
                      <ArrowLeftToLine className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white" side="right">
                    Collapse
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2" role="menu">
                {menuItems.map((item) => {
                  const isActive = pathname.includes(item.href);
                  return (
                    <SidebarMenuItem key={item.title} role="none">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.href} passHref legacyBehavior>
                            <SidebarMenuButton
                              className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'
                                } ${isActive
                                  ? 'bg-content-background text-black hover:text-black'
                                  : 'bg-transparent text-black hover:text-black'
                                }`}
                              aria-current={isActive ? 'page' : undefined}
                              role="menuitem"
                              title={item.title}
                            >
                              <div
                                className={`rounded ${isActive
                                  ? 'bg-content-background'
                                  : 'bg-transparent'
                                  }`}
                              >
                                <Image
                                  src={item.iconSrc}
                                  width={isCollapsed ? 36 : 24}
                                  height={isCollapsed ? 36 : 24}
                                  alt={item.alt}
                                  loading="lazy"
                                  sizes={isCollapsed ? "36px" : "24px"}
                                  className={
                                    isCollapsed
                                      ? 'h-7 w-7 object-contain'
                                      : 'h-6 w-6 object-contain'
                                  }
                                />
                              </div>
                              {!isCollapsed && (
                                <span className="text-sm font-medium">
                                  {item.title}
                                </span>
                              )}
                            </SidebarMenuButton>
                          </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right" className="bg-black text-white">
                            {item.title}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

              {state !== "expanded" && (
                <div className="mt-10">
                  <Tooltip>
                    <TooltipTrigger>
                      <button
                        className="hover:bg-white rounded-full p-1 transition-colors duration-200 cursor-pointer"
                        onClick={handleToggleSidebar}
                        aria-label="Expand sidebar"
                        type="button"
                      >
                        <ArrowRightToLine aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-black text-white"
                      side="right"
                    >
                      Expand
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {!isGuest && (
          <>
            <SidebarFooter className="flex justify-between items-center px-3 py-2 border-t text-lg">
              <NavUser user={session?.user} />
            </SidebarFooter>
            <SidebarRail />
          </>
        )}
      </Sidebar>
    </nav>
  );
}