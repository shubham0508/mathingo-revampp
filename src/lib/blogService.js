import { rawBlogsData } from '@/components/blog/blog';

function extractHeadingsFromHtml(htmlContent) {
  if (!htmlContent) return [];
  const headings = [];
  const headingRegex = /<h([2-4])\s[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, '').trim(),
    });
  }
  return headings;
}

export const allBlogs = rawBlogsData
  .map((blog) => ({
    ...blog,
    headings: extractHeadingsFromHtml(blog.contentHTML),
  }))
  .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

export function getAllBlogs(page = 1, limit = 9) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedBlogs = allBlogs.slice(start, end);
  return {
    blogs: paginatedBlogs,
    hasMore: end < allBlogs.length,
    total: allBlogs.length,
  };
}

export function getBlogBySlug(slug) {
  return allBlogs.find((blog) => blog.slug === slug);
}

export function getRecentBlogs(count = 3) {
  return allBlogs.slice(0, count);
}

export function getRelatedBlogs(currentBlogSlug, tags, limit = 3) {
  if (!tags || tags.length === 0) return [];
  const related = allBlogs
    .filter((blog) => blog.slug !== currentBlogSlug)
    .map((blog) => {
      const commonTags = blog.tags.filter((tag) => tags.includes(tag));
      return { ...blog, commonTagsCount: commonTags.length };
    })
    .filter((blog) => blog.commonTagsCount > 0)
    .sort((a, b) => {
      if (b.commonTagsCount !== a.commonTagsCount) {
        return b.commonTagsCount - a.commonTagsCount;
      }
      return 0;
    })
    .slice(0, limit);
  return related;
}
