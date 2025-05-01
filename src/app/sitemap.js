import { siteConfig } from "@/config/site";
import { productSectionsData } from "@/config/constants";

export default async function sitemap() {
  const baseUrl = siteConfig.url;
  
  const routes = [
    "/",
    "/pricing",
    "/login",
    "/register",
    "/dashboard",
    "/blog",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));
  
  const productRoutes = productSectionsData.map((product) => ({
    url: `${baseUrl}${product.learnMoreLink}`,
    lastModified: new Date().toISOString(),
  }));
  
  return [...routes, ...productRoutes];
}