export type Role = "visitor" | "operator" | "admin";

export type ZoneActivity = "calm" | "active" | "dense";

export type VehicleStatus = "boarding" | "enroute" | "delayed" | "returning";

export type TelemetryKind =
  | "gps"
  | "rfid"
  | "ir"
  | "camera"
  | "weather"
  | "system";

export type AlertSeverity = "low" | "medium" | "high";

export interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  capacity: number;
  currentLoad: number;
  popularity: number;
  activity: ZoneActivity;
  species: string[];
}

export interface Vehicle {
  id: string;
  name: string;
  operatorName: string;
  capacity: number;
  passengers: number;
  zoneId: string;
  battery: number;
  signal: number;
  speedKmph: number;
  etaMinutes: number;
  status: VehicleStatus;
  deviceId: string;
}

export interface SafariSlot {
  id: string;
  startTime: string;
  durationMinutes: number;
  baseCapacity: number;
  allocatedCapacity: number;
  booked: number;
  recommendedStatus: "open" | "limited" | "throttled";
}

export interface Booking {
  id: string;
  visitorName: string;
  ticketCount: number;
  slotId: string;
  status: "confirmed" | "checked-in" | "completed";
  vehicleId: string;
  qrCode: string;
  rfidTag: string;
  createdAt: string;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  kind: TelemetryKind;
  sourceId: string;
  vehicleId?: string;
  zoneId?: string;
  message: string;
  payload: Record<string, string | number | boolean | null>;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  zoneId?: string;
  vehicleId?: string;
  createdAt: string;
  detail: string;
}

export interface Sighting {
  id: string;
  species: string;
  zoneId: string;
  confidence: number;
  capturedAt: string;
  source: "esp32-cam" | "ranger-log";
}

export interface WeatherSnapshot {
  condition: string;
  temperatureC: number;
  humidity: number;
  windKmph: number;
  updatedAt: string;
}

export interface SlotRecommendation {
  slotId: string;
  allocatedCapacity: number;
  status: "open" | "limited" | "throttled";
  reasoning: string;
}

export interface SafariState {
  generatedAt: string;
  reserveName: string;
  zones: Zone[];
  vehicles: Vehicle[];
  slots: SafariSlot[];
  bookings: Booking[];
  telemetry: TelemetryEvent[];
  alerts: Alert[];
  sightings: Sighting[];
  weather: WeatherSnapshot;
  recommendations: SlotRecommendation[];
  metrics: {
    activeVisitors: number;
    occupancyRate: number;
    zonePressure: number;
    conservationScore: number;
  };
}

export interface TelemetryPayload {
  kind: TelemetryKind;
  sourceId: string;
  vehicleId?: string;
  zoneId?: string;
  message?: string;
  payload?: Record<string, string | number | boolean | null>;
}
