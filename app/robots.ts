// SEO (#38): explicit allow-all + sitemap pointer. The mobile-only gate is
// user-agent based and must NOT be mirrored here — blocking crawlers in
// robots would kill indexing; Googlebot Smartphone sees the real pages.
import type { MetadataRoute } from "next";
import { SITE_URL } from "../shared/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
