'use client';

import { useState, memo } from 'react';
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
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <nav aria-label="Main Sidebar Navigation">
      <Sidebar side="left" className="bg-blue-50 h-screen" collapsible="icon">
        <SidebarContent className="mt-8">
          <div
            className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-1.5 px-4'}`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="flex items-center justify-center">
                  <Image
                    src="/images/icons/company_logo.svg"
                    width={isCollapsed ? 36 : 44}
                    height={isCollapsed ? 32 : 40}
                    alt="Mathz AI Logo"
                    className={isCollapsed ? 'h-8' : 'h-10'}
                    priority
                  />
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">Mathz AI</TooltipContent>
              )}
            </Tooltip>
            {!isCollapsed && (
              <h1 className="bg-gradient-secondary bg-clip-text text-2xl md:text-xl font-bold !text-transparent">
                Mathz AI
              </h1>
            )}
          </div>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
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
                              className={`p-1 rounded ${
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
                                // className={
                                //   isCollapsed
                                //     ? 'h-7 w-7 object-contain'
                                //     : 'h-6 w-6 object-contain'
                                // }
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
                          <TooltipContent side="right">
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
