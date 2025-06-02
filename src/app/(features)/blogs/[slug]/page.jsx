import { getBlogBySlug, getRelatedBlogs, getAllBlogs as getAllBlogSlugs } from '@/lib/blogService';
import BlogLayout from '@/components/blog/BlogLayout';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const blog = getBlogBySlug(params.slug);
    if (!blog) return { title: 'Blog Post Not Found' };
    return {
        title: blog.seo.title,
        description: blog.seo.description,
        openGraph: {
            title: blog.seo.title,
            description: blog.seo.description,
            images: [
                {
                    url: blog.coverImage,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                },
            ],
            type: 'article',
            publishedTime: new Date(blog.publishedDate).toISOString(),
            authors: [blog.author.name],
            tags: blog.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.seo.title,
            description: blog.seo.description,
            images: [blog.coverImage],
        },
    };
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

    return (
        <main className="bg-white dark:bg-gray-950">
            <BlogLayout blog={blog} relatedBlogs={relatedBlogs} />
        </main>
    );
}