import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleDollarSign, HelpCircle, Scale } from "lucide-react";
import RentCalculator from "@/components/RentCalculator";
import { createDefaultRooms } from "@/lib/rentCalculator";
import {
  formatRent,
  getSplitType,
  RENT_LEVELS,
  SPLIT_TYPES,
} from "@/lib/pseo";
import { getAbsoluteUrl } from "@/lib/site";

interface SplitPageProps {
  params: {
    type: string;
    rent: string;
  };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SPLIT_TYPES.flatMap((type) =>
    RENT_LEVELS.map((rent) => ({
      type: type.slug,
      rent: String(rent),
    })),
  );
}

export function generateMetadata({ params }: SplitPageProps): Metadata {
  const splitType = getSplitType(params.type);
  const rent = Number(params.rent);

  if (!splitType || !RENT_LEVELS.includes(rent)) {
    return { title: "Rent split not found" };
  }

  const formattedRent = formatRent(rent);
  const title = `How to Fairly Split ${formattedRent} Rent for ${splitType.label}`;
  const description = `${splitType.description} Use our free calculator to divide ${formattedRent} monthly rent by bedroom size, amenities, and occupancy.`;
  const pageUrl = getAbsoluteUrl(`/split/${splitType.slug}/${rent}`);

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
    },
  };
}

export default function SplitPage({ params }: SplitPageProps) {
  const splitType = getSplitType(params.type);
  const rent = Number(params.rent);

  if (!splitType || !RENT_LEVELS.includes(rent)) {
    notFound();
  }

  const rooms = createDefaultRooms(splitType.roomCount).map((room, index) =>
    index === 0
      ? {
          ...room,
          squareFeet: splitType.primaryBath ? 200 : 170,
          privateBath: Boolean(splitType.primaryBath),
          premiumFeature: Boolean(splitType.primaryFeature),
          couple: Boolean(splitType.coupleInPrimary),
        }
      : room,
  );
  const formattedRent = formatRent(rent);
  const faqs = [
    {
      question: `What is the fairest way to split ${formattedRent} rent?`,
      answer:
        "Separate the value of private bedrooms from the value of shared spaces. Weight the private portion by room size and amenities, then divide the shared portion by the number of occupants.",
    },
    {
      question: "How much more should a roommate with a private bathroom pay?",
      answer:
        "This calculator applies a 15% premium to the private-room weight. The final dollar difference also depends on room size, other amenities, total rent, and the number of occupants.",
    },
    {
      question: "Should a couple sharing one bedroom pay two full shares?",
      answer:
        "Usually not. A couple uses one private bedroom but two shares of the kitchen, living room, and other common areas. This model charges one weighted bedroom share plus two common-area shares.",
    },
  ];
  const pageUrl = getAbsoluteUrl(`/split/${splitType.slug}/${rent}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Fair Roommate Rent Split Calculator",
      url: pageUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: `Calculate a fair split of ${formattedRent} rent for ${splitType.label}.`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-ink/60 transition hover:text-ledger"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to all rent splits
        </Link>
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-ledger">
              Roommate rent guide
            </p>
            <h1 className="mt-4 max-w-5xl font-display text-4xl font-semibold leading-[1.03] tracking-[-0.035em] sm:text-6xl">
              How to fairly split {formattedRent} rent for {splitType.label}
            </h1>
          </div>
          <div className="border-l border-ink/20 pl-5 lg:col-span-4">
            <p className="leading-relaxed text-ink/65">{splitType.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <RentCalculator initialRent={rent} initialRooms={rooms} />
      </section>

      <section className="border-y border-ink/15 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="grid size-11 place-items-center rounded-full bg-ink text-bone">
              <Scale className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold">
              Why this split is more defensible
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-ink/65 lg:col-span-7 lg:col-start-6">
            <p>
              An equal split assumes every roommate receives the same private value.
              In {splitType.label.toLowerCase()}, that assumption can break down when
              one room is larger, includes an en-suite bathroom, or comes with a
              balcony or walk-in closet. The calculator gives those differences a
              visible weight instead of turning them into a negotiation with no anchor.
            </p>
            <p>
              Seventy-five percent of {formattedRent} is treated as the private-room
              pool. Bedroom square footage sets the base weight, a private bathroom
              adds 15%, and a balcony or walk-in closet adds 8%. The remaining 25%
              represents shared living space and is divided by occupant count. You can
              move any slider or toggle any feature to see the exact effect immediately.
            </p>
            <p>
              The result is a practical starting point, not a legal rule. Roommates can
              still account for parking, utilities, furnishing, income, or lease risk
              separately. What matters most is agreeing on the inputs together and
              sharing the same written breakdown before money is due.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="grid size-11 place-items-center rounded-full border border-ink/20">
              <HelpCircle className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold">Questions roommates ask</h2>
          </div>
          <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-7 lg:col-start-6">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-bold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <CircleDollarSign className="size-5 shrink-0 text-ledger" aria-hidden="true" />
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-7 text-ink/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
