'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const STORAGE_KEY = 'breadcrumb_visited_paths';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

const ROUTE_CONFIGS = {
    'homework-assistant': {
        baseLabel: 'Submit Questions',
        segments: {
            'select-questions': 'Select Questions',
            'problem-solver': 'Solutions'
        }
    },
    'ai-math-tutor': {
        baseLabel: 'Submit Questions',
        segments: {
            'select-questions': 'Select Question',
            'ai-tutor-solution': 'AI Math Tutor'
        }
    },
    'blogs': {
        baseLabel: 'Blogs',
        segments: {}
    }
};

const getStoredPaths = () => {
    if (typeof window === 'undefined') return new Set();

    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (!stored) return new Set();

        const { paths, timestamp } = JSON.parse(stored);

        if (Date.now() - timestamp > SESSION_TIMEOUT) {
            sessionStorage.removeItem(STORAGE_KEY);
            return new Set();
        }

        return new Set(paths);
    } catch (error) {
        console.warn('Failed to load breadcrumb paths from storage:', error);
        return new Set();
    }
};

const storePaths = (paths) => {
    if (typeof window === 'undefined') return;

    try {
        const data = {
            paths: Array.from(paths),
            timestamp: Date.now()
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.warn('Failed to store breadcrumb paths:', error);
    }
};

const formatBlogTitle = (slug) => {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const SmartBreadcrumb = () => {
    const pathname = usePathname();
    const [visitedPaths, setVisitedPaths] = useState(new Set());
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedPaths = getStoredPaths();
        setVisitedPaths(storedPaths);
        setIsLoaded(true);
    }, []);

    const trackPath = useCallback((path) => {
        setVisitedPaths(prev => {
            const newPaths = new Set([...prev, path]);
            storePaths(newPaths);
            return newPaths;
        });
    }, []);

    useEffect(() => {
        if (isLoaded && pathname) {
            trackPath(pathname);
        }
    }, [pathname, isLoaded, trackPath]);

    const generateBreadcrumbs = useCallback(() => {
        if (!pathname || !isLoaded) return [];

        const pathSegments = pathname.split('/').filter(Boolean);

        if (pathSegments.length <= 1) return [];

        const [mainSection, ...restSegments] = pathSegments;
        const config = ROUTE_CONFIGS[mainSection];

        if (!config) return [];

        const breadcrumbs = [];

        const basePath = `/${mainSection}`;
        breadcrumbs.push({
            label: config.baseLabel,
            href: basePath,
            isActive: restSegments.length === 0
        });

        let currentPath = basePath;

        for (let i = 0; i < restSegments.length; i++) {
            const segment = restSegments[i];
            currentPath += `/${segment}`;

            const isCurrentPage = i === restSegments.length - 1;

            if (!isCurrentPage && !visitedPaths.has(currentPath)) {
                continue;
            }

            let label;

            if (mainSection === 'blogs' && i === restSegments.length - 1) {
                label = formatBlogTitle(segment);
            } else {
                label = config.segments[segment];
                if (!label) continue;
            }

            breadcrumbs.push({
                label,
                href: currentPath,
                isActive: isCurrentPage
            });
        }

        return breadcrumbs;
    }, [pathname, visitedPaths, isLoaded]);

    const breadcrumbs = generateBreadcrumbs();

    if (!isLoaded || breadcrumbs.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                            <BreadcrumbItem>
                                {crumb.isActive ? (
                                    <BreadcrumbPage className="font-medium">
                                        {crumb.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={crumb.href}
                                            className="transition-colors hover:text-foreground"
                                        >
                                            {crumb.label}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

export default SmartBreadcrumb;

export const useBreadcrumbHistory = () => {
    const [visitedPaths, setVisitedPaths] = useState(new Set());

    useEffect(() => {
        const storedPaths = getStoredPaths();
        setVisitedPaths(storedPaths);
    }, []);

    const addPath = useCallback((path) => {
        setVisitedPaths(prev => {
            const newPaths = new Set([...prev, path]);
            storePaths(newPaths);
            return newPaths;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setVisitedPaths(new Set());
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const hasVisited = useCallback((path) => {
        return visitedPaths.has(path);
    }, [visitedPaths]);

    return {
        visitedPaths: Array.from(visitedPaths),
        addPath,
        clearHistory,
        hasVisited
    };
};