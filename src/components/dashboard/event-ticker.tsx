import { SafariState } from "@/lib/types";
import { fmtTime } from "./utils";

export function EventTicker({ state }: { state: SafariState }) {
  return (
    <div className="rounded-[2.5rem] border border-[#FFFFFF]/10 bg-[#050A07]/30 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#8B9E91]">Realtime event ticker</p>
          <h2 className="mt-2 text-3xl font-light tracking-tight text-white">
            Telemetry, <span className="text-[#8B9E91] font-normal italic">check-ins, weather, and alerts</span>
          </h2>
        </div>
        <div className="rounded-full border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 px-4 py-2 text-sm text-[#8B9E91]">
          Weather: <span className="text-white">Humid haze · 31°C</span>
        </div>
      </div>

      <div className="mt-10 overflow-hidden">
        <div className="flex flex-col gap-1">
          {state.telemetry.map((event, idx) => (
            <div
              key={event.id}
              className={`group flex items-center gap-8 border-b border-[#FFFFFF]/5 py-4 transition-colors hover:bg-white/5 ${
                idx === 0 ? "border-t" : ""
              }`}
            >
              <span className="w-24 text-sm font-medium tabular-nums text-[#8B9E91]">{fmtTime(event.timestamp)}</span>
              <span className="w-32 text-xs uppercase tracking-widest text-[#00D166]">{event.kind}</span>
              <span className="flex-1 text-sm text-[#FFFFFF] group-hover:text-white transition-colors">
                {event.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
