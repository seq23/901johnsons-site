import type { MetadataRoute } from "next";
import { reunions } from "@/data/reunions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://901johnsons.com";

// next.config.mjs sets trailingSlash: true, so the 200-serving form of every
// route carries a trailing slash (/connections/ 200, /connections 308).
// /admin/ and /upload/ are utility surfaces and are deliberately omitted.
const STATIC_ROUTES = ["/", "/reunions/", "/family-history/", "/connections/"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...STATIC_ROUTES, ...reunions.map((reunion) => `/reunions/${reunion.slug}/`)];
  return routes.map((route) => ({ url: `${SITE_URL}${route}` }));
}
