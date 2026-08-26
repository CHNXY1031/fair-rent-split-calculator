export const RENT_LEVELS = Array.from(
  { length: (6000 - 1500) / 250 + 1 },
  (_, index) => 1500 + index * 250,
);

export interface SplitType {
  slug: string;
  label: string;
  shortLabel: string;
  roomCount: number;
  description: string;
  coupleInPrimary?: boolean;
  primaryBath?: boolean;
  primaryFeature?: boolean;
}

export const SPLIT_TYPES: SplitType[] = [
  {
    slug: "2-bedroom-1-bath",
    label: "a 2-Bedroom, 1-Bath Apartment",
    shortLabel: "2 Bed · 1 Bath",
    roomCount: 2,
    description:
      "Compare two bedrooms by size while sharing one bathroom and all common spaces.",
  },
  {
    slug: "2-bedroom-master-suite",
    label: "a 2-Bedroom with Master Suite",
    shortLabel: "2 Bed · Master Suite",
    roomCount: 2,
    description:
      "Price the primary bedroom fairly when it includes more space and a private bathroom.",
    primaryBath: true,
  },
  {
    slug: "3-bedroom-2-bath",
    label: "a 3-Bedroom, 2-Bath Apartment",
    shortLabel: "3 Bed · 2 Bath",
    roomCount: 3,
    description:
      "Balance three room sizes and the value of a private or more convenient bathroom.",
    primaryBath: true,
  },
  {
    slug: "3-bedroom-master-suite",
    label: "a 3-Bedroom with Master Suite",
    shortLabel: "3 Bed · Master Suite",
    roomCount: 3,
    description:
      "Account for a larger primary room, en-suite bath, and premium storage or outdoor space.",
    primaryBath: true,
    primaryFeature: true,
  },
  {
    slug: "4-bedroom-house",
    label: "a 4-Bedroom Shared House",
    shortLabel: "4 Bedroom House",
    roomCount: 4,
    description:
      "Create a transparent split across four rooms without relying on a blunt equal division.",
  },
  {
    slug: "couple-sharing-master",
    label: "a Couple Sharing the Master Bedroom",
    shortLabel: "Couple in Master",
    roomCount: 3,
    description:
      "Charge the couple for the premium room and their additional share of common-area use.",
    coupleInPrimary: true,
    primaryBath: true,
    primaryFeature: true,
  },
];

export function getSplitType(slug: string): SplitType | undefined {
  return SPLIT_TYPES.find((type) => type.slug === slug);
}

export function formatRent(rent: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rent);
}
