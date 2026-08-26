"use client";

import { useMemo, useState } from "react";
import {
  Bath,
  Check,
  ChevronDown,
  ClipboardCopy,
  DoorOpen,
  Info,
  Minus,
  Plus,
  Ruler,
  Sparkles,
  Users,
} from "lucide-react";
import {
  calculateRentSplit,
  createDefaultRooms,
  getSizeLabel,
  MAX_ROOMS,
  MIN_ROOMS,
  type RoomInput,
} from "@/lib/rentCalculator";
import { cn } from "@/lib/utils";

interface RentCalculatorProps {
  initialRent?: number;
  initialRooms?: RoomInput[];
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function createShareText(
  totalRent: number,
  result: ReturnType<typeof calculateRentSplit>,
): string {
  const lines = [
    "FAIR RENT BREAKDOWN",
    "———————————————",
    `Total monthly rent: ${money.format(totalRent)}`,
    `Roommates: ${result.totalOccupants}`,
    "",
  ];

  result.rooms.forEach((room, index) => {
    lines.push(
      `${index + 1}. ${room.roomName} — ${money.format(room.amount)} total (${room.percentage.toFixed(1)}%)`,
    );
    room.occupants.forEach((occupant) => {
      const comparison =
        occupant.differenceFromEqualCents === 0
          ? "same as an equal split"
          : `${money.format(Math.abs(occupant.differenceFromEqual))} ${occupant.differenceFromEqualCents > 0 ? "above" : "below"} an equal split`;
      lines.push(`   ${occupant.label}: ${money.format(occupant.amount)}/month · ${comparison}`);
    });
    lines.push("");
  });

  lines.push(
    "Method: 75% is weighted by bedroom size and private features; 25% is shared by occupant count.",
    "Calculated with Fair Rent Split.",
  );

  return lines.join("\n");
}

export default function RentCalculator({
  initialRent = 2500,
  initialRooms,
}: RentCalculatorProps) {
  const [totalRent, setTotalRent] = useState(initialRent);
  const [rooms, setRooms] = useState<RoomInput[]>(
    initialRooms ?? createDefaultRooms(2),
  );
  const [copied, setCopied] = useState(false);
  const result = useMemo(
    () => calculateRentSplit(Math.max(totalRent, 1), rooms),
    [rooms, totalRent],
  );

  function updateRoom(id: string, patch: Partial<RoomInput>) {
    setRooms((current) =>
      current.map((room) => (room.id === id ? { ...room, ...patch } : room)),
    );
  }

  function addRoom() {
    if (rooms.length >= MAX_ROOMS) return;
    const index = rooms.length + 1;
    setRooms((current) => [
      ...current,
      {
        id: `room-${index}-${Date.now()}`,
        name: `Room ${index}`,
        squareFeet: 130,
        privateBath: false,
        premiumFeature: false,
        couple: false,
      },
    ]);
  }

  function removeRoom() {
    if (rooms.length <= MIN_ROOMS) return;
    setRooms((current) => current.slice(0, -1));
  }

  async function copyBreakdown() {
    const text = createShareText(totalRent, result);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <section id="calculator" className="scroll-mt-6">
      <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
        <aside className="reveal overflow-hidden rounded-[1.75rem] bg-ink text-bone shadow-lift lg:sticky lg:top-5 lg:col-span-5">
          <div className="border-b border-bone/15 px-5 py-6 sm:px-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">
                  Your apartment
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  Price the differences.
                </h2>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-bone/20">
                <DoorOpen className="size-5" aria-hidden="true" />
              </span>
            </div>

            <label htmlFor="total-rent" className="text-sm font-semibold text-bone/70">
              Total monthly rent
            </label>
            <div className="mt-2 flex items-center rounded-2xl border border-bone/20 bg-bone/5 px-4 focus-within:border-amber">
              <span className="text-2xl text-bone/55">$</span>
              <input
                id="total-rent"
                type="number"
                min="1"
                step="50"
                value={totalRent}
                onChange={(event) =>
                  setTotalRent(Math.max(1, Number(event.target.value) || 1))
                }
                className="min-w-0 flex-1 bg-transparent px-2 py-4 text-3xl font-bold tabular-nums outline-none"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-bone/45">
                USD / mo
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Number of rooms</p>
                <p className="text-xs text-bone/50">Between 2 and 5 bedrooms</p>
              </div>
              <div className="flex items-center rounded-full border border-bone/20 p-1">
                <button
                  type="button"
                  onClick={removeRoom}
                  disabled={rooms.length <= MIN_ROOMS}
                  className="grid size-9 place-items-center rounded-full transition hover:bg-bone/10 disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label="Remove a room"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span className="w-9 text-center text-lg font-bold tabular-nums">
                  {rooms.length}
                </span>
                <button
                  type="button"
                  onClick={addRoom}
                  disabled={rooms.length >= MAX_ROOMS}
                  className="grid size-9 place-items-center rounded-full transition hover:bg-bone/10 disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label="Add a room"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[62vh] space-y-3 overflow-y-auto px-3 py-3 sm:px-4">
            {rooms.map((room, index) => {
              const size = getSizeLabel(room.squareFeet);
              return (
                <details
                  key={room.id}
                  open={index === 0}
                  className="group rounded-2xl border border-bone/15 bg-bone/[0.045]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-bone/10 text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{room.name}</p>
                        <p className="text-xs capitalize text-bone/50">
                          {size} · {room.squareFeet} sq ft
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="size-4 shrink-0 transition group-open:rotate-180" aria-hidden="true" />
                  </summary>

                  <div className="border-t border-bone/10 px-4 pb-4 pt-4">
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-bone/60">
                      <span className="flex items-center gap-2">
                        <Ruler className="size-3.5" aria-hidden="true" />
                        Relative size
                      </span>
                      <span className="rounded-full bg-bone/10 px-2 py-1 capitalize text-bone">
                        {size}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="80"
                      max="260"
                      step="5"
                      value={room.squareFeet}
                      onChange={(event) =>
                        updateRoom(room.id, {
                          squareFeet: Number(event.target.value),
                        })
                      }
                      className="mt-3 w-full"
                      aria-label={`${room.name} estimated square footage`}
                    />
                    <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wide text-bone/35">
                      <span>Small</span>
                      <span>Medium</span>
                      <span>Master</span>
                    </div>

                    <div className="mt-4 grid gap-2">
                      <FeatureToggle
                        checked={room.privateBath}
                        onChange={(checked) => updateRoom(room.id, { privateBath: checked })}
                        icon={Bath}
                        label="Private bathroom"
                        note="+15% room value"
                      />
                      <FeatureToggle
                        checked={room.premiumFeature}
                        onChange={(checked) =>
                          updateRoom(room.id, { premiumFeature: checked })
                        }
                        icon={Sparkles}
                        label="Balcony or walk-in closet"
                        note="+8% room value"
                      />
                      <FeatureToggle
                        checked={room.couple}
                        onChange={(checked) => updateRoom(room.id, { couple: checked })}
                        icon={Users}
                        label="Couple sharing this room"
                        note="2 common-area shares"
                      />
                    </div>
                  </div>
                </details>
              );
            })}
          </div>

          <div className="flex items-start gap-3 border-t border-bone/15 px-5 py-4 text-xs leading-relaxed text-bone/55 sm:px-7">
            <Info className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden="true" />
            <p>
              The model separates private room value from shared-space use, so a
              couple pays more together without being charged for two bedrooms.
            </p>
          </div>
        </aside>

        <div className="reveal reveal-late lg:col-span-7 lg:-mt-8 lg:pt-8">
          <div className="rounded-[1.75rem] border border-ink/15 bg-paper p-5 shadow-lift sm:p-7 lg:p-9">
            <div className="flex flex-col gap-5 border-b border-ink/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-ledger">
                  Fair monthly split
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                  Every dollar, explained.
                </h2>
                <p className="mt-2 text-sm text-ink/55">
                  {result.totalOccupants} {result.totalOccupants === 1 ? "person" : "people"} · {rooms.length} bedrooms · updates instantly
                </p>
              </div>
              <button
                type="button"
                onClick={copyBreakdown}
                className={cn(
                  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition",
                  copied
                    ? "bg-ledger text-white"
                    : "bg-amber text-ink hover:-translate-y-0.5 hover:brightness-105",
                )}
              >
                {copied ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <ClipboardCopy className="size-4" aria-hidden="true" />
                )}
                {copied ? "Copied to clipboard" : "Copy Breakdown for Roommates"}
              </button>
            </div>

            <div className="mt-7 space-y-4">
              {result.rooms.map((room, roomIndex) => (
                <article
                  key={room.roomId}
                  className="relative overflow-hidden rounded-2xl border border-ink/15 bg-bone/50 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/20 text-sm font-bold">
                        {roomIndex + 1}
                      </span>
                      <div>
                        <h3 className="font-bold">{room.roomName}</h3>
                        <p className="mt-1 text-xs capitalize text-ink/50">
                          {room.size} room · {room.occupantCount} {room.occupantCount === 1 ? "occupant" : "occupants"}
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-2xl font-extrabold tabular-nums">
                        {money.format(room.amount)}
                      </p>
                      <p className="text-xs font-semibold text-ink/50">
                        room total · {room.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10">
                    <div
                      className="h-full rounded-full bg-ledger transition-[width] duration-500"
                      style={{ width: `${room.percentage}%` }}
                    />
                  </div>

                  <div className="mt-4 divide-y divide-ink/10 border-t border-ink/10">
                    {room.occupants.map((occupant) => (
                      <div
                        key={occupant.label}
                        className="flex flex-col gap-1 py-3 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="text-sm font-semibold">{occupant.label}</span>
                        <div className="flex items-baseline gap-3 sm:text-right">
                          <strong className="tabular-nums">
                            {money.format(occupant.amount)} / person
                          </strong>
                          <span
                            className={cn(
                              "text-xs font-bold",
                              occupant.differenceFromEqualCents > 0
                                ? "text-amber"
                                : occupant.differenceFromEqualCents < 0
                                  ? "text-ledger"
                                  : "text-ink/45",
                            )}
                          >
                            {occupant.differenceFromEqualCents === 0
                              ? "equal split"
                              : `${occupant.differenceFromEqualCents > 0 ? "+" : "−"}${money.format(Math.abs(occupant.differenceFromEqual))} vs. equal`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/15 bg-ink/15 sm:grid-cols-3">
              <Metric
                label="Private room pool"
                value={money.format(result.privatePoolCents / 100)}
                note="75% weighted"
              />
              <Metric
                label="Common area pool"
                value={money.format(result.commonPoolCents / 100)}
                note="25% by occupant"
              />
              <Metric
                label="Plain equal share"
                value={money.format(result.equalShare)}
                note="per person, for context"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: typeof Bath;
  label: string;
  note: string;
}

function FeatureToggle({
  checked,
  onChange,
  icon: Icon,
  label,
  note,
}: FeatureToggleProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition",
        checked
          ? "border-amber/70 bg-amber/10"
          : "border-bone/10 hover:border-bone/25",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full",
          checked ? "bg-amber text-ink" : "bg-bone/10 text-bone/60",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-[11px] text-bone/45">{note}</span>
      </span>
      <span
        className={cn(
          "grid size-5 place-items-center rounded border",
          checked ? "border-amber bg-amber text-ink" : "border-bone/25",
        )}
      >
        {checked && <Check className="size-3" aria-hidden="true" />}
      </span>
    </label>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-paper p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/45">{label}</p>
      <p className="mt-1 text-lg font-extrabold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-ink/45">{note}</p>
    </div>
  );
}
