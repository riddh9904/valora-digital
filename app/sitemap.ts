import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { insights } from "@/content/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = insights.map((i) => i.published).sort().at(-1);
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1, lastModified: latest },
    { url: `${site.url}/insights`, changeFrequency: "weekly", priority: 0.7, lastModified: latest },
    ...insights.map((i) => ({
      url: `${site.url}/insights/${i.slug}`,
      lastModified: i.published,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
