import type { MetadataRoute } from "next";
import { RENT_LEVELS, SPLIT_TYPES } from "@/lib/pseo";
import { BASE_URL, getAbsoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const generatedPages = SPLIT_TYPES.flatMap((type) =>
    RENT_LEVELS.map((rent) => ({
      url: getAbsoluteUrl(`/split/${type.slug}/${rent}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...generatedPages,
  ];
}
