import { describe, expect, it } from "vitest";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { BASE_URL, getAbsoluteUrl } from "../lib/site";

describe("production SEO URLs", () => {
  it("uses the production domain for all 115 sitemap entries", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toHaveLength(115);
    expect(new Set(urls)).toHaveLength(115);
    expect(urls.every((url) => url.startsWith(BASE_URL))).toBe(true);
  });

  it("uses the production domain for robots and pSEO metadata", () => {
    const robotsMetadata = robots();

    expect(robotsMetadata.sitemap).toBe(`${BASE_URL}/sitemap.xml`);
    expect(getAbsoluteUrl("/split/2-bedroom-master-suite/2500")).toBe(
      `${BASE_URL}/split/2-bedroom-master-suite/2500`,
    );
  });
});
