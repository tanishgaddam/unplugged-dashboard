import { SafariState } from "@/lib/types";
import { Activity, Users } from "lucide-react";

export function ZoneSummary({ state }: { state: SafariState }) {
  return (
    <div className="glass-panel p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B9E91] font-bold mb-2">Habitat Load</p>
          <h2 className="text-3xl font-light text-white italic">Zone <span className="font-semibold text-[#FFB800]">Activity</span></h2>
        </div>
        <Activity className="h-6 w-6 text-[#FFB800]/50" />
      </div>

      <div className="space-y-8">
        {state.zones.map((zone) => (
          <div key={zone.id} className="group transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  zone.activity === "dense" ? "bg-[#FF4500] animate-pulse shadow-[0_0_8px_rgba(255,69,0,0.8)]" : 
                  zone.activity === "active" ? "bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.8)]" : "bg-[#00D166] shadow-[0_0_8px_rgba(0,209,102,0.8)]"
                }`} />
                <span className="text-xs font-bold text-[#FFFFFF] tracking-widest uppercase">{zone.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8B9E91] uppercase">
                <Users className="h-3 w-3" />
                <span>{zone.currentLoad} / {zone.capacity}</span>
              </div>
            </div>
            
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full transition-all duration-1000 ease-out rounded-full ${
                  zone.activity === "dense" ? "bg-gradient-to-r from-[#FF4500] to-[#FF7F50]" : 
                  zone.activity === "active" ? "bg-gradient-to-r from-[#FFB800] to-[#FFD54F]" : 
                  "bg-gradient-to-r from-[#00D166] to-[#40E08A]"
                }`}
                style={{ width: `${(zone.currentLoad / zone.capacity) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-4 rounded-xl bg-[#050A07]/40 border border-[#FFFFFF]/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
        <p className="text-[10px] text-center text-[#8B9E91] font-bold uppercase tracking-[0.2em]">
          Automated Slot Allocation: <span className="text-[#FFB800] italic">Synchronized</span>
        </p>
      </div>
    </div>
  );
}
