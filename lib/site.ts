export const BASE_URL = "https://fair-rent-split-calculator.vercel.app";

export function getAbsoluteUrl(path = ""): string {
  if (!path) return BASE_URL;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
