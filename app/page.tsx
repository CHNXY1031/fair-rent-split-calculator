import Link from "next/link";
import { ArrowUpRight, Calculator, MessageSquareText, ShieldCheck } from "lucide-react";
import RentCalculator from "@/components/RentCalculator";
import { SPLIT_TYPES } from "@/lib/pseo";

const benefits = [
  {
    icon: Calculator,
    title: "A formula you can explain",
    text: "Room value and shared-space use are calculated separately, so every adjustment has a reason.",
  },
  {
    icon: MessageSquareText,
    title: "Ready for the group chat",
    text: "Copy a plain-English breakdown for WhatsApp, iMessage, Discord, or email in one click.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Nothing is uploaded or saved. The calculation happens entirely in your browser.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-16 sm:px-8 sm:pt-24">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="reveal lg:col-span-8 lg:col-start-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-paper px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em]">
              Free roommate calculator
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl lg:text-[5.6rem]">
              Split the rent.
              <span className="block text-ledger">Keep the peace.</span>
            </h1>
          </div>
          <div className="reveal reveal-late border-l border-ink/20 pl-5 lg:col-span-4 lg:pb-2">
            <p className="max-w-md text-lg leading-relaxed text-ink/65">
              A fair roommate rent split based on bedroom size, private amenities,
              and how many people share the common space—not awkward guesswork.
            </p>
            <a
              href="#calculator"
              className="mt-5 inline-flex items-center gap-2 font-bold text-ledger"
            >
              Calculate your split
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <RentCalculator />
      </section>

      <section className="border-y border-ink/15 bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ledger">
                Why it works
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
                Fair does not always mean equal.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
              {benefits.map(({ icon: Icon, title, text }, index) => (
                <article
                  key={title}
                  className={index === 1 ? "sm:translate-y-7" : ""}
                >
                  <div className="grid size-10 place-items-center rounded-full bg-ink text-bone">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">
              Common apartment setups
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Start with your floor plan.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink/55">
            Open a preconfigured rent guide, then adjust the numbers to match your
            actual rooms.
          </p>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SPLIT_TYPES.map((type, index) => (
            <Link
              key={type.slug}
              href={`/split/${type.slug}/2500`}
              className={index === 4 ? "lg:col-start-2" : ""}
            >
              <article className="group h-full rounded-2xl border border-ink/15 bg-paper p-5 transition hover:-translate-y-1 hover:border-ledger hover:shadow-lift">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/40">
                    Setup {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold">
                  {type.shortLabel}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">
                  {type.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
