"use client";

import { useEffect, useState, useMemo } from "react";
import { SafariState } from "@/lib/types";
import { Navigation } from "lucide-react";
import { fmtTime, zoneName } from "./utils";

export function MapView({ state }: { state: SafariState }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const svgPaths = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => (
      <path
        key={i}
        d={`M${Math.random() * 800},${Math.random() * 600} Q${Math.random() * 800},${Math.random() * 600} ${Math.random() * 800},${Math.random() * 600} T${Math.random() * 800},${Math.random() * 600}`}
        fill="none"
        stroke="#00D166"
        strokeWidth="1"
        strokeOpacity={0.08}
        className="animate-pulse-soft"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ));
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-stretch">
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#050A07] rounded-[2rem] border border-white/5">
         <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(circle_at_center,rgba(0,209,102,0.4)_0%,transparent_70%)]" />
         <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="none">
            {svgPaths}
            <path d="M200,300 C300,100 500,500 600,200" fill="none" stroke="#FFB800" strokeWidth="2" strokeDasharray="4 8" strokeOpacity={0.3} className="animate-[dash_20s_linear_infinite]" />
            <path d="M150,450 C400,600 600,100 700,400" fill="none" stroke="#00D166" strokeWidth="2" strokeDasharray="4 8" strokeOpacity={0.2} className="animate-[dash_15s_linear_infinite]" />
         </svg>
      </div>

      <div className="absolute top-6 left-6 z-10">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B9E91] mb-1">Reserve Topology</p>
        <h3 className="text-2xl text-white font-serif italic">Live Grid <span className="font-semibold text-[#FFB800] normal-case">Sync</span></h3>
      </div>

      <div className="absolute top-6 right-6 z-10 text-right">
        <p className="text-[9px] uppercase tracking-widest font-bold text-[#8B9E91]">Last Packet</p>
        <p className="text-sm font-mono text-[#00D166]">{fmtTime(state.generatedAt)}</p>
      </div>

      {state.zones.map((zone) => (
        <div
          key={zone.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 z-20"
          style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
        >
          <div
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border text-center transition-all duration-500 hover:scale-110 ${
              zone.activity === "dense"
                ? "border-[#FF4500]/40 bg-[#FF4500]/10 text-[#FFFFFF] shadow-[0_0_20px_rgba(255,69,0,0.15)]"
                : zone.activity === "active"
                  ? "border-[#FFB800]/40 bg-[#FFB800]/10 text-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.1)]"
                  : "border-[#00D166]/30 bg-[#00D166]/5 text-[#00D166] shadow-[0_0_20px_rgba(0,209,102,0.05)]"
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">{zone.id}</span>
            <span className="text-xs font-bold px-2 truncate w-full">{zone.name}</span>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-2 rounded-full ${
                    i < (zone.activity === "dense" ? 3 : zone.activity === "active" ? 2 : 1)
                      ? (zone.activity === "dense" ? "bg-[#FF4500]" : zone.activity === "active" ? "bg-[#FFB800]" : "bg-[#00D166]")
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {state.vehicles.map((vehicle, index) => {
        const zone = state.zones.find((item) => item.id === vehicle.zoneId);
        return zone ? (
          <div
            key={vehicle.id}
            className="absolute transition-all duration-1000 ease-in-out z-30"
            style={{ 
              left: `${zone.x + 4 + index * 3}%`, 
              top: `${zone.y + 10 - index * 4}%` 
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-[#FFB800]/40" />
              <div className="relative h-4 w-4 rounded-full border-2 border-[#050A07] bg-[#FFB800] shadow-[0_0_15px_rgba(255,184,0,0.5)]" />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#050A07]/90 px-2 py-1 text-[10px] font-bold text-white border border-[#FFFFFF]/10 backdrop-blur-md">
                {vehicle.name}
              </div>
            </div>
          </div>
        ) : null;
      })}

      <div className="absolute bottom-6 right-6 z-40 w-80 bg-[#050A07]/80 backdrop-blur-xl border border-[#FFFFFF]/10 rounded-2xl overflow-hidden shadow-2xl">
         <div className="p-3 border-b border-[#FFFFFF]/5 bg-[#050A07]/50">
            <p className="text-[9px] uppercase tracking-widest font-bold text-[#8B9E91]">Fleet Telemetry</p>
         </div>
         <div className="max-h-[320px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {state.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 bg-[#050A07]/40 rounded-xl mb-2 border border-[#FFFFFF]/5 last:mb-0 hover:bg-[#FFFFFF]/5 transition-colors">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 flex items-center justify-center border border-[#FFB800]/20">
                         <Navigation className="w-4 h-4 text-[#FFB800]" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-white leading-tight">{vehicle.name}</p>
                        <p className="text-[10px] text-[#8B9E91] truncate w-24">{zoneName(state, vehicle.zoneId)}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                         vehicle.status === "enroute" ? "bg-[#00D166]/10 text-[#00D166] border border-[#00D166]/20" :
                         vehicle.status === "delayed" ? "bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/20" : 
                         "bg-[#FFFFFF]/5 text-[#8B9E91] border border-[#FFFFFF]/10"
                      }`}>
                         {vehicle.status}
                      </span>
                      <p className="text-[11px] font-bold text-white"><span className="text-[#FFB800]">{vehicle.speedKmph}</span> KM/H</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-[#8B9E91] border-t border-[#FFFFFF]/5 pt-3 mt-3">
                   <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                         <span>Battery</span>
                         <span className="text-white">{vehicle.battery}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-[#FFFFFF]/10 w-full overflow-hidden">
                         <div className={`h-full transition-all duration-1000 ${vehicle.battery < 30 ? "bg-[#FF4500]" : "bg-[#00D166]"}`} style={{ width: `${vehicle.battery}%` }} />
                      </div>
                   </div>
                   <div className="pl-4 border-l border-[#FFFFFF]/5 text-right flex flex-col items-end">
                      <span className="block mb-1">Signal</span>
                      <span className="text-white">v{Math.floor(vehicle.signal / 10)}.0</span>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
