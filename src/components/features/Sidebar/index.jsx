'use client';

import { useState, memo, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: 'Homework Assistant',
    iconSrc: '/images/icons/notebook-pen.png',
    alt: 'Homework Assistant Icon',
  },
  {
    title: 'AI Math Tutor',
    iconSrc: '/images/icons/math_tutor.png',
    alt: 'AI Math Tutor Icon',
  },
  {
    title: 'Smart Solution Check',
    iconSrc: '/images/icons/computer.png',
    alt: 'Smart Solution Check Icon',
  },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState('Homework Assistant');
  const { state , setOpen } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const pathname = usePathname();

  useEffect(() => {
    const shouldCollapse = pathname.includes('/select-questions');
    if (shouldCollapse && state !== 'collapsed') {
      setOpen(false);
    } else if (!shouldCollapse && state !== 'expanded') {
      setOpen(true);
    }
  }, [pathname, setOpen]);

  return (
    <nav aria-label="Main Sidebar Navigation">
      <Sidebar side="left" className="h-screen" collapsible="icon">
        <SidebarContent className="mt-8">
          <div
            className={`flex ${isCollapsed ? 'justify-center items-center px-1 ml-1' : 'gap-1.5 px-4'}`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="flex align-middle justify-center">
                  <Image
                    src="/images/icons/company_logo.svg"
                    width={isCollapsed ? 32 : 44}
                    height={isCollapsed ? 32 : 44}
                    alt="Mathz AI Logo"
                    className={isCollapsed ? 'h-8' : 'h-10'}
                    priority
                  />
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-black text-white">Mathz AI</TooltipContent>
              )}
            </Tooltip>
            {!isCollapsed && (
              <h1 className="bg-gradient-secondary bg-clip-text text-2xl !text-transparent font-roca">
                Mathz AI
              </h1>
            )}
          </div>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {menuItems.map((item) => {
                  const isActive = activeItem === item.title;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            className={`flex items-center ${
                              isCollapsed ? 'justify-center' : 'gap-3'
                            } ${
                              isActive
                                ? 'bg-content-background text-black'
                                : 'bg-transparent hover:bg-content-background hover:bg-opacity-50 text-black'
                            }`}
                            onClick={() => setActiveItem(item.title)}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <div
                              className={`rounded ${
                                isActive
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
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </nav>
  );
}
