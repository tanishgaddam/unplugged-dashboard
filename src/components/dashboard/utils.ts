import { SafariState } from "@/lib/types";

export function statusTone(value: string) {
  if (value === "high" || value === "dense" || value === "throttled" || value === "delayed") {
    return "text-rose-300";
  }
  if (value === "limited" || value === "active" || value === "medium") {
    return "text-amber-200";
  }
  return "text-emerald-200";
}

export function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function zoneName(state: SafariState, zoneId?: string) {
  return state.zones.find((zone) => zone.id === zoneId)?.name ?? "Unassigned";
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
