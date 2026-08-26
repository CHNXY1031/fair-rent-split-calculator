import type { MetadataRoute } from "next";
import { RENT_LEVELS, SPLIT_TYPES } from "@/lib/pseo";

function getBaseUrl(): string {
  const fallback = "https://fairrentsplit.com";
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return fallback;

  try {
    return new URL(configured).origin;
  } catch {
    return fallback;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const generatedPages = SPLIT_TYPES.flatMap((type) =>
    RENT_LEVELS.map((rent) => ({
      url: `${baseUrl}/split/${type.slug}/${rent}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...generatedPages,
  ];
}
