// SEO (#38): the three public pages. The notice page stays out on purpose
// (noindex). Analysis pages join here when E1 publishes real content.
import type { MetadataRoute } from "next";
import { SITE_URL } from "../shared/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/what-is-copero`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
