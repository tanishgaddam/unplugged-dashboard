import {
  Booking,
  SafariSlot,
  SafariState,
  Sighting,
  SlotRecommendation,
  TelemetryPayload,
  Vehicle,
  WeatherSnapshot,
  Zone,
  TelemetryEvent,
} from "@/lib/types";

function saveState(state: SafariState) {
  // Static export mode: in-memory only
}

function loadState(): SafariState | null {
  return null;
}

// Seed Data
const zoneSeed: Zone[] = [
  {
    id: "north-canopy",
    name: "North Canopy",
    x: 22,
    y: 18,
    capacity: 28,
    currentLoad: 19,
    popularity: 82,
    activity: "active",
    species: ["Hornbill", "Leopard", "Langur"],
  },
  {
    id: "river-bend",
    name: "River Bend",
    x: 54,
    y: 26,
    capacity: 24,
    currentLoad: 21,
    popularity: 91,
    activity: "dense",
    species: ["Crocodile", "Otter", "Kingfisher"],
  },
  {
    id: "grassland-loop",
    name: "Grassland Loop",
    x: 72,
    y: 54,
    capacity: 30,
    currentLoad: 16,
    popularity: 78,
    activity: "active",
    species: ["Deer", "Elephant", "Peacock"],
  },
  {
    id: "wetland-gate",
    name: "Wetland Gate",
    x: 38,
    y: 68,
    capacity: 22,
    currentLoad: 11,
    popularity: 58,
    activity: "calm",
    species: ["Marsh Crocodile", "Stork", "Turtle"],
  },
];

const vehicleSeed: Vehicle[] = [
  {
    id: "veh-1",
    name: "Safari Alpha",
    operatorName: "Riya Deshmukh",
    capacity: 10,
    passengers: 8,
    zoneId: "north-canopy",
    battery: 84,
    signal: 92,
    speedKmph: 18,
    etaMinutes: 14,
    status: "enroute",
    deviceId: "esp32-alpha",
  },
  {
    id: "veh-2",
    name: "Safari Bravo",
    operatorName: "Arjun More",
    capacity: 10,
    passengers: 10,
    zoneId: "river-bend",
    battery: 61,
    signal: 78,
    speedKmph: 11,
    etaMinutes: 9,
    status: "delayed",
    deviceId: "esp32-bravo",
  },
  {
    id: "veh-3",
    name: "Safari Cinder",
    operatorName: "Neha Kale",
    capacity: 12,
    passengers: 6,
    zoneId: "wetland-gate",
    battery: 93,
    signal: 88,
    speedKmph: 15,
    etaMinutes: 18,
    status: "boarding",
    deviceId: "esp32-cinder",
  },
];

const slotSeed: SafariSlot[] = [
  {
    id: "slot-0630",
    startTime: "06:30 AM",
    durationMinutes: 120,
    baseCapacity: 20,
    allocatedCapacity: 20,
    booked: 18,
    recommendedStatus: "limited",
  },
  {
    id: "slot-0900",
    startTime: "09:00 AM",
    durationMinutes: 120,
    baseCapacity: 24,
    allocatedCapacity: 24,
    booked: 12,
    recommendedStatus: "open",
  },
  {
    id: "slot-1400",
    startTime: "02:00 PM",
    durationMinutes: 120,
    baseCapacity: 24,
    allocatedCapacity: 24,
    booked: 24,
    recommendedStatus: "throttled",
  },
  {
    id: "slot-1630",
    startTime: "04:30 PM",
    durationMinutes: 120,
    baseCapacity: 20,
    allocatedCapacity: 20,
    booked: 9,
    recommendedStatus: "open",
  },
];

const bookingSeed: Booking[] = [
  {
    id: "BK-40218",
    visitorName: "Aditi Shah",
    ticketCount: 4,
    slotId: "slot-0630",
    status: "confirmed",
    vehicleId: "veh-3",
    qrCode: "QR-BK-40218",
    rfidTag: "RFID-18A2",
    createdAt: "2026-03-22T07:15:00.000Z",
  },
  {
    id: "BK-40224",
    visitorName: "Kabir Jain",
    ticketCount: 2,
    slotId: "slot-0630",
    status: "checked-in",
    vehicleId: "veh-1",
    qrCode: "QR-BK-40224",
    rfidTag: "RFID-29Q4",
    createdAt: "2026-03-22T07:20:00.000Z",
  },
];

const sightingSeed: Sighting[] = [
  {
    id: "SG-1",
    species: "Leopard",
    zoneId: "north-canopy",
    confidence: 0.91,
    capturedAt: "2026-03-22T07:24:00.000Z",
    source: "esp32-cam",
  },
  {
    id: "SG-2",
    species: "Crocodile",
    zoneId: "river-bend",
    confidence: 0.88,
    capturedAt: "2026-03-22T07:27:00.000Z",
    source: "ranger-log",
  },
];

const weatherSeed: WeatherSnapshot = {
  condition: "Humid haze",
  temperatureC: 31,
  humidity: 78,
  windKmph: 9,
  updatedAt: "2026-03-22T07:28:00.000Z",
};

// Helpers
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function isoNow() {
  return new Date().toISOString();
}

function recalculateSlots(slots: SafariSlot[], zones: Zone[], vehicles: Vehicle[]) {
  const averagePressure =
    zones.reduce((sum, zone) => sum + zone.currentLoad / zone.capacity, 0) / zones.length;
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status !== "returning").length;

  return slots.map((slot, index) => {
    const pressurePenalty = averagePressure > 0.72 ? 8 : averagePressure > 0.6 ? 5 : 2;
    const vehicleBoost = activeVehicles >= 3 ? 2 : -2;
    const demandBias = index === 1 ? -4 : index === 3 ? 3 : 0;
    const allocatedCapacity = Math.max(
      8,
      Math.min(slot.baseCapacity, slot.baseCapacity - pressurePenalty + vehicleBoost + demandBias),
    );
    const fill = slot.booked / allocatedCapacity;
    const recommendedStatus: SafariSlot["recommendedStatus"] =
      fill > 0.92 ? "throttled" : fill > 0.72 ? "limited" : "open";
    return { ...slot, allocatedCapacity, recommendedStatus };
  });
}

function buildRecommendations(slots: SafariSlot[], zones: Zone[]): SlotRecommendation[] {
  const zonePressure = zones.reduce((sum, zone) => sum + zone.currentLoad / zone.capacity, 0) / zones.length;
  return slots.map((slot) => {
    const reasoning =
      zonePressure > 0.72
        ? "High zone pressure detected. Reduce inventory and stagger departures."
        : slot.recommendedStatus === "limited"
          ? "Balanced demand. Allow bookings with controlled admissions."
          : "Spare vehicle and zone capacity available.";
    return {
      slotId: slot.id,
      allocatedCapacity: slot.allocatedCapacity,
      status: slot.recommendedStatus,
      reasoning,
    };
  });
}

function metricsFromState(zones: Zone[], vehicles: Vehicle[], slots: SafariSlot[], bookings: Booking[]) {
  const activeVisitors = vehicles.reduce((sum, vehicle) => sum + vehicle.passengers, 0);
  const booked = slots.reduce((sum, slot) => sum + slot.booked, 0);
  const capacity = slots.reduce((sum, slot) => sum + slot.allocatedCapacity, 0);
  const occupancyRate = capacity === 0 ? 0 : booked / capacity;
  const zonePressure = zones.reduce((sum, zone) => sum + zone.currentLoad / zone.capacity, 0) / zones.length;
  const checkIns = bookings.filter((booking) => booking.status !== "confirmed").length;
  const conservationScore = Math.max(
    55,
    Math.round(100 - zonePressure * 32 + checkIns * 1.5 + vehicles.filter((v) => v.signal > 80).length * 2),
  );

  return {
    activeVisitors,
    occupancyRate,
    zonePressure,
    conservationScore,
  };
}

function initialState(): SafariState {
  const saved = loadState();
  if (saved) return saved;

  const zones = clone(zoneSeed);
  const vehicles = clone(vehicleSeed);
  const slots = recalculateSlots(clone(slotSeed), zones, vehicles);
  const bookings = clone(bookingSeed);
  const state: SafariState = {
    generatedAt: isoNow(),
    reserveName: "Unplugged Smart Safari Grid",
    zones,
    vehicles,
    slots,
    bookings,
    telemetry: [],
    alerts: [
      {
        id: "AL-1",
        severity: "medium",
        title: "Initial System Check",
        zoneId: "river-bend",
        createdAt: isoNow(),
        detail: "Ecological monitoring active. All sensors reported healthy.",
      }
    ],
    sightings: clone(sightingSeed),
    weather: weatherSeed,
    recommendations: buildRecommendations(slots, zones),
    metrics: metricsFromState(zones, vehicles, slots, bookings),
  };
  saveState(state);
  return state;
}

let demoState: SafariState = (globalThis as any).demoState || initialState();
(globalThis as any).demoState = demoState;

export function getDemoState() {
  return demoState;
}

export function resetDemoState() {
  const newState = initialState();
  (globalThis as any).demoState = newState;
  demoState = newState;
  
  return demoState;
}

export function advanceSimulation() {
  demoState.generatedAt = isoNow();
  
  // Update battery and signal randomly
  demoState.vehicles.forEach(v => {
    v.battery = Math.max(10, Math.min(100, v.battery + (Math.random() > 0.5 ? 1 : -1)));
    v.signal = Math.max(40, Math.min(100, v.signal + (Math.random() > 0.8 ? 2 : -2)));
    if (Math.random() > 0.8) {
      v.zoneId = randomChoice(demoState.zones).id;
    }
  });

  // Recap everything
  demoState.slots = recalculateSlots(demoState.slots, demoState.zones, demoState.vehicles);
  demoState.recommendations = buildRecommendations(demoState.slots, demoState.zones);
  demoState.metrics = metricsFromState(demoState.zones, demoState.vehicles, demoState.slots, demoState.bookings);
  
  saveState(demoState);
  return demoState;
}

export function createBooking(payload: { visitorName: string; slotId: string; ticketCount: number }) {
  const slot = demoState.slots.find(s => s.id === payload.slotId);
  if (!slot) throw new Error("Slot not found");

  const booking: Booking = {
    id: makeId("BK"),
    visitorName: payload.visitorName,
    ticketCount: payload.ticketCount,
    slotId: payload.slotId,
    status: "confirmed",
    vehicleId: randomChoice(demoState.vehicles).id,
    qrCode: `QR-${makeId("BK")}`,
    rfidTag: `RFID-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
    createdAt: isoNow(),
  };

  demoState.bookings.push(booking);
  slot.booked += payload.ticketCount;
  
  demoState.metrics = metricsFromState(demoState.zones, demoState.vehicles, demoState.slots, demoState.bookings);
  
  saveState(demoState);
  return booking;
}

export function ingestTelemetry(payload: TelemetryPayload) {
  const event: TelemetryEvent = {
    id: makeId("EV"),
    timestamp: isoNow(),
    kind: payload.kind,
    sourceId: payload.sourceId,
    vehicleId: payload.vehicleId,
    zoneId: payload.zoneId,
    message: payload.message || `Telemetry: ${payload.kind} event reported.`,
    payload: payload.payload || {},
  };

  demoState.telemetry.unshift(event);
  if (demoState.telemetry.length > 50) demoState.telemetry.pop();

  // Logic for sensors
  if (payload.kind === "ir" && payload.zoneId) {
    const zone = demoState.zones.find(z => z.id === payload.zoneId);
    if (zone) {
      zone.currentLoad = Math.min(zone.capacity, zone.currentLoad + (payload.payload?.count as number || 1));
      zone.activity = zone.currentLoad / zone.capacity > 0.8 ? "dense" : "active";
    }
  }

  demoState.metrics = metricsFromState(demoState.zones, demoState.vehicles, demoState.slots, demoState.bookings);
  
  saveState(demoState);
  return event;
}
