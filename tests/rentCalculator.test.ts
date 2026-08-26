import { describe, expect, it } from "vitest";
import {
  calculateRentSplit,
  createDefaultRooms,
  getRoomWeight,
  PRIVATE_BATH_MULTIPLIER,
  PREMIUM_FEATURE_MULTIPLIER,
  type RoomInput,
} from "../lib/rentCalculator";

function twoEqualRooms(): RoomInput[] {
  return createDefaultRooms(2).map((room) => ({
    ...room,
    squareFeet: 140,
    privateBath: false,
  }));
}

describe("calculateRentSplit", () => {
  it("returns an equal split for identical rooms and occupants", () => {
    const result = calculateRentSplit(3000, twoEqualRooms());

    expect(result.rooms.map((room) => room.amount)).toEqual([1500, 1500]);
    expect(result.rooms.map((room) => room.percentage)).toEqual([50, 50]);
    expect(result.rooms[0].occupants[0].differenceFromEqualCents).toBe(0);
  });

  it("applies the documented private-feature multipliers", () => {
    const room: RoomInput = {
      ...twoEqualRooms()[0],
      privateBath: true,
      premiumFeature: true,
    };

    expect(getRoomWeight(room)).toBeCloseTo(
      140 * PRIVATE_BATH_MULTIPLIER * PREMIUM_FEATURE_MULTIPLIER,
    );
  });

  it("charges a private-bath room more than an otherwise equal room", () => {
    const rooms = twoEqualRooms();
    rooms[0].privateBath = true;
    const result = calculateRentSplit(2400, rooms);

    expect(result.rooms[0].amountCents).toBeGreaterThan(result.rooms[1].amountCents);
  });

  it("gives a couple two common-area shares but only one bedroom share", () => {
    const rooms = twoEqualRooms();
    rooms[0].couple = true;
    const result = calculateRentSplit(3000, rooms);

    expect(result.totalOccupants).toBe(3);
    expect(result.rooms[0].amountCents).toBe(162500);
    expect(result.rooms[1].amountCents).toBe(137500);
    expect(result.rooms[0].occupants).toHaveLength(2);
  });

  it("preserves every cent for awkward totals and multiple occupants", () => {
    const rooms = createDefaultRooms(5);
    rooms[0].couple = true;
    rooms[2].privateBath = true;
    rooms[4].premiumFeature = true;
    const result = calculateRentSplit(4321.09, rooms);
    const roomTotal = result.rooms.reduce((sum, room) => sum + room.amountCents, 0);
    const occupantTotal = result.rooms
      .flatMap((room) => room.occupants)
      .reduce((sum, occupant) => sum + occupant.amountCents, 0);

    expect(roomTotal).toBe(432109);
    expect(occupantTotal).toBe(432109);
  });

  it("rejects unsupported room counts and invalid rent", () => {
    expect(() => calculateRentSplit(0, twoEqualRooms())).toThrow();
    expect(() => calculateRentSplit(2000, createDefaultRooms(2).slice(0, 1))).toThrow();
  });
});
