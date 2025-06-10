import { getBlogBySlug, getRelatedBlogs, getAllBlogs as getAllBlogSlugs } from '@/lib/blogService';
import BlogLayout from '@/components/blog/BlogLayout';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { siteConfig } from "@/config/site";
import { generateMetadata as generatePageMetadata } from '@/config/seo';
import { createOrganizationSchema } from '@/lib/seoUtils';

export async function generateMetadata({ params }) {
    const blog = getBlogBySlug(params.slug);
    
    if (!blog) {
        return generatePageMetadata({
            title: 'Blog Post Not Found',
            url: `${siteConfig.url}/blogs/${params.slug}`,
        });
    }

    const coverImageUrl = blog.coverImage 
        ? (blog.coverImage.startsWith('http') ? blog.coverImage : `${siteConfig.url}${blog.coverImage}`)
        : siteConfig.ogImage;

    const baseMetadata = generatePageMetadata({
        title: blog.seo.title,
        description: blog.seo.description,
        image: coverImageUrl,
        url: `${siteConfig.url}/blogs/${blog.slug}`,
        type: "article",
    });

    baseMetadata.openGraph = {
        ...baseMetadata.openGraph,
        publishedTime: new Date(blog.publishedDate).toISOString(),
        modifiedTime: new Date(blog.modifiedDate || blog.publishedDate).toISOString(),
        authors: [blog.author?.name || siteConfig.name],
        tags: blog.tags,
        section: blog.category,
    };
    
    if (blog.author?.twitterHandle) {
        baseMetadata.twitter.creator = blog.author.twitterHandle;
    }
    
    baseMetadata.keywords = blog.tags?.join(', ');

    return baseMetadata;
}

export async function generateStaticParams() {
    const { blogs } = getAllBlogSlugs(1, 1000);
    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

export default async function BlogPostPage({ params }) {
    const blog = getBlogBySlug(params.slug);

    if (!blog) {
        notFound();
    }

    const relatedBlogs = getRelatedBlogs(blog.slug, blog.tags, 3);
    
    const postUrl = `${siteConfig.url}/blogs/${blog.slug}`;
    const coverImageUrl = blog.coverImage 
        ? (blog.coverImage.startsWith('http') ? blog.coverImage : `${siteConfig.url}${blog.coverImage}`)
        : siteConfig.ogImage;

    const authorSchema = blog.author && blog.author.name ? {
        "@type": blog.author.type || "Person",
        "name": blog.author.name,
        ...(blog.author.url && { "url": blog.author.url })
    } : createOrganizationSchema();

    const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
        },
        "headline": blog.title,
        "name": blog.title,
        "description": blog.seo.description,
        "image": {
            "@type": "ImageObject",
            "url": coverImageUrl,
            "width": 1200,
            "height": 630
        },
        "author": authorSchema,
        "publisher": createOrganizationSchema(),
        "datePublished": new Date(blog.publishedDate).toISOString(),
        "dateModified": new Date(blog.modifiedDate || blog.publishedDate).toISOString(),
        "articleSection": blog.category || undefined,
        "keywords": blog.tags?.join(", "),
        "url": postUrl,
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Blog",
                    "item": `${siteConfig.url}/blogs`
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": blog.title
                }
            ]
        }
    };

    return (
        <>
            <Script
                id="blog-post-schema"
                type="application/ld+json"
                strategy="afterInteractive" 
            >
                {JSON.stringify(blogPostingSchema)}
            </Script>
            <main className="bg-white">
                <BlogLayout blog={blog} relatedBlogs={relatedBlogs} />
            </main>
        </>
    );
}