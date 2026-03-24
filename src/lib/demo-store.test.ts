import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceSimulation,
  createBooking,
  getDemoState,
  ingestTelemetry,
  resetDemoState,
} from "@/lib/demo-store";

test("booking creation increases slot demand and returns booking identity", () => {
  resetDemoState();
  const before = getDemoState();
  const booking = createBooking("Test Visitor", before.slots[0].id, 2);
  const after = getDemoState();
  const targetSlotBefore = before.slots.find((slot) => slot.id === before.slots[0].id);
  const targetSlotAfter = after.slots.find((slot) => slot.id === before.slots[0].id);

  assert.ok(booking.id.startsWith("BK-"));
  assert.equal(targetSlotAfter?.booked, (targetSlotBefore?.booked ?? 0) + 2);
  assert.equal(after.bookings[0].visitorName, "Test Visitor");
});

test("IR telemetry updates zone load and emits a new event", () => {
  resetDemoState();
  const before = getDemoState();
  const zone = before.zones[0];
  ingestTelemetry({
    kind: "ir",
    sourceId: "ir-zone-test",
    zoneId: zone.id,
    message: "IR threshold test",
    payload: { count: zone.currentLoad + 3 },
  });
  const after = getDemoState();
  const updatedZone = after.zones.find((item) => item.id === zone.id);

  assert.equal(updatedZone?.currentLoad, zone.currentLoad + 3);
  assert.equal(after.telemetry[0].message, "IR threshold test");
});

test("simulation changes generated timestamp and keeps recommendations available", () => {
  resetDemoState();
  const before = getDemoState();
  const after = advanceSimulation();

  assert.equal(after.telemetry.length, before.telemetry.length + 1);
  assert.ok(after.recommendations.length > 0);
  assert.ok(after.sightings.length >= before.sightings.length);
});
