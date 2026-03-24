import { useState } from "react";
import { SafariState, TelemetryKind } from "@/lib/types";

export function TelemetryLab({ state, onEventSent }: { state: SafariState; onEventSent: () => void }) {
  const [targetVehicleId, setTargetVehicleId] = useState(state.vehicles[0]?.id || "");
  const [targetZoneId, setTargetZoneId] = useState(state.zones[0]?.id || "");
  const [telemetryKind, setTelemetryKind] = useState<TelemetryKind>("gps");
  const [telemetryMessage, setTelemetryMessage] = useState("ESP32 heartbeat from patrol unit.");
  const [telemetryStatus, setTelemetryStatus] = useState("");

  const pushTelemetry = async () => {
    setTelemetryStatus("Sending payload...");
    try {
      const { ingestTelemetry } = await import("@/lib/demo-store");
      ingestTelemetry({
        kind: telemetryKind,
        sourceId: "web-console",
        vehicleId: targetVehicleId,
        zoneId: targetZoneId,
        message: telemetryMessage,
      });
      setTelemetryStatus("Event injected successfully.");
      onEventSent();
    } catch (err) {
      setTelemetryStatus("Injection failed.");
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 lg:col-span-1">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-400">ESP32 telemetry lab</p>
      <h3 className="mt-2 text-xl font-semibold">Inject device-compatible payloads</h3>
      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Vehicle</span>
            <select
              value={targetVehicleId}
              onChange={(e) => setTargetVehicleId(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300/50"
            >
              {state.vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Zone</span>
            <select
              value={targetZoneId}
              onChange={(e) => setTargetZoneId(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300/50"
            >
              {state.zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm text-stone-300">Telemetry type</span>
          <select
            value={telemetryKind}
            onChange={(e) => setTelemetryKind(e.target.value as TelemetryKind)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300/50"
          >
            <option value="gps">GPS update</option>
            <option value="rfid">RFID tap</option>
            <option value="ir">IR sensor trip</option>
            <option value="system">Manual override</option>
            <option value="camera">Camera event</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-stone-300">Message</span>
          <textarea
            value={telemetryMessage}
            onChange={(e) => setTelemetryMessage(e.target.value)}
            className="h-24 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-amber-300/50"
          />
        </label>
        <button
          onClick={() => void pushTelemetry()}
          className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
        >
          Send payload locally
        </button>
        <p className="text-center text-sm text-amber-200/80">{telemetryStatus}</p>
      </div>
    </div>
  );
}
