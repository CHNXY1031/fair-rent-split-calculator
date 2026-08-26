export const MIN_ROOMS = 2;
export const MAX_ROOMS = 5;
export const PRIVATE_RENT_SHARE = 0.75;
export const COMMON_RENT_SHARE = 0.25;
export const PRIVATE_BATH_MULTIPLIER = 1.15;
export const PREMIUM_FEATURE_MULTIPLIER = 1.08;

export type RoomSize = "small" | "medium" | "master";

export interface RoomInput {
  id: string;
  name: string;
  squareFeet: number;
  privateBath: boolean;
  premiumFeature: boolean;
  couple: boolean;
}

export interface OccupantShare {
  label: string;
  amountCents: number;
  amount: number;
  percentage: number;
  differenceFromEqualCents: number;
  differenceFromEqual: number;
}

export interface RoomShare {
  roomId: string;
  roomName: string;
  roomWeight: number;
  size: RoomSize;
  occupantCount: number;
  amountCents: number;
  amount: number;
  percentage: number;
  occupants: OccupantShare[];
}

export interface RentSplitResult {
  totalRentCents: number;
  totalRent: number;
  totalOccupants: number;
  equalShareCents: number;
  equalShare: number;
  privatePoolCents: number;
  commonPoolCents: number;
  rooms: RoomShare[];
}

export function getSizeLabel(squareFeet: number): RoomSize {
  if (squareFeet < 120) return "small";
  if (squareFeet >= 180) return "master";
  return "medium";
}

export function getRoomWeight(room: RoomInput): number {
  const safeSquareFeet = Math.max(50, Math.min(400, room.squareFeet));
  const bathWeight = room.privateBath ? PRIVATE_BATH_MULTIPLIER : 1;
  const featureWeight = room.premiumFeature ? PREMIUM_FEATURE_MULTIPLIER : 1;
  return safeSquareFeet * bathWeight * featureWeight;
}

function allocateCents(totalCents: number, weights: number[]): number[] {
  if (totalCents < 0 || !Number.isInteger(totalCents)) {
    throw new Error("The cent total must be a non-negative integer.");
  }

  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  if (weightTotal <= 0) {
    throw new Error("At least one positive weight is required.");
  }

  const exactShares = weights.map((weight) => (totalCents * weight) / weightTotal);
  const shares = exactShares.map(Math.floor);
  const remaining = totalCents - shares.reduce((sum, share) => sum + share, 0);

  const priority = exactShares
    .map((share, index) => ({ index, remainder: share - Math.floor(share) }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  for (let index = 0; index < remaining; index += 1) {
    shares[priority[index].index] += 1;
  }

  return shares;
}

function toDollars(cents: number): number {
  return cents / 100;
}

export function calculateRentSplit(
  totalRent: number,
  rooms: RoomInput[],
): RentSplitResult {
  if (!Number.isFinite(totalRent) || totalRent <= 0) {
    throw new Error("Total rent must be greater than zero.");
  }
  if (rooms.length < MIN_ROOMS || rooms.length > MAX_ROOMS) {
    throw new Error(`Room count must be between ${MIN_ROOMS} and ${MAX_ROOMS}.`);
  }

  const totalRentCents = Math.round(totalRent * 100);
  const occupantCounts = rooms.map((room) => (room.couple ? 2 : 1));
  const totalOccupants = occupantCounts.reduce((sum, count) => sum + count, 0);
  const privatePoolCents = Math.round(totalRentCents * PRIVATE_RENT_SHARE);
  const commonPoolCents = totalRentCents - privatePoolCents;
  const weights = rooms.map(getRoomWeight);

  const privateShares = allocateCents(privatePoolCents, weights);
  const commonShares = allocateCents(commonPoolCents, occupantCounts);
  const roomAmounts = rooms.map(
    (_room, index) => privateShares[index] + commonShares[index],
  );
  const equalOccupantShares = allocateCents(
    totalRentCents,
    Array.from({ length: totalOccupants }, () => 1),
  );
  let occupantCursor = 0;

  const roomShares: RoomShare[] = rooms.map((room, roomIndex) => {
    const occupantCount = occupantCounts[roomIndex];
    const occupantAmounts = allocateCents(
      roomAmounts[roomIndex],
      Array.from({ length: occupantCount }, () => 1),
    );

    const occupants = occupantAmounts.map((amountCents, occupantIndex) => {
      const equalAmountCents = equalOccupantShares[occupantCursor];
      occupantCursor += 1;
      return {
        label:
          occupantCount === 1
            ? room.name
            : `${room.name} · Person ${occupantIndex + 1}`,
        amountCents,
        amount: toDollars(amountCents),
        percentage: (amountCents / totalRentCents) * 100,
        differenceFromEqualCents: amountCents - equalAmountCents,
        differenceFromEqual: toDollars(amountCents - equalAmountCents),
      };
    });

    return {
      roomId: room.id,
      roomName: room.name,
      roomWeight: weights[roomIndex],
      size: getSizeLabel(room.squareFeet),
      occupantCount,
      amountCents: roomAmounts[roomIndex],
      amount: toDollars(roomAmounts[roomIndex]),
      percentage: (roomAmounts[roomIndex] / totalRentCents) * 100,
      occupants,
    };
  });

  return {
    totalRentCents,
    totalRent: toDollars(totalRentCents),
    totalOccupants,
    equalShareCents: Math.floor(totalRentCents / totalOccupants),
    equalShare: toDollars(Math.floor(totalRentCents / totalOccupants)),
    privatePoolCents,
    commonPoolCents,
    rooms: roomShares,
  };
}

export function createDefaultRooms(count: number): RoomInput[] {
  const safeCount = Math.max(MIN_ROOMS, Math.min(MAX_ROOMS, Math.round(count)));
  return Array.from({ length: safeCount }, (_, index) => ({
    id: `room-${index + 1}`,
    name: index === 0 ? "Room 1 · Primary" : `Room ${index + 1}`,
    squareFeet: index === 0 ? 180 : 140,
    privateBath: false,
    premiumFeature: false,
    couple: false,
  }));
}
