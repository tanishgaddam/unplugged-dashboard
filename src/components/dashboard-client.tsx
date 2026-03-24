"use client";

import { useEffect, useState } from "react";
import { SafariState } from "@/lib/types";
import { StatsGrid } from "./dashboard/stats-grid";
import { MapView } from "./dashboard/map-view";
import { BookingForm } from "./dashboard/booking-form";
import { EventTicker } from "./dashboard/event-ticker";
import { ZoneSummary } from "./dashboard/zone-summary";
import { WeatherCard } from "./dashboard/weather-card";
import { fmtTime, zoneName } from "./dashboard/utils";
import { LayoutDashboard, Map, Camera, Users, Settings, ActivitySquare, Car } from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Zones", icon: Map, active: false },
  { name: "Animal Activity", icon: Camera, active: false },
  { name: "Tourists", icon: Users, active: false },
  { name: "Ranger Vehicles", icon: Car, active: false },
  { name: "Analytics", icon: ActivitySquare, active: false },
];

export default function DashboardClient({ mode }: { mode: string }) {
  const [state, setState] = useState<SafariState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [simMessage, setSimMessage] = useState("");

  const isAdmin = mode === "admin" || mode === "overview";
  const isOperator = mode === "operator" || mode === "admin";
  const isVisitor = mode === "visitor" || mode === "admin";

  const fetchState = async () => {
    try {
      const { getDemoState } = await import("@/lib/demo-store");
      setState(getDemoState());
    } catch (err) {
      setError("Failed to sync with safari field.");
    }
  };

  useEffect(() => {
    void fetchState();
    const timer = setInterval(() => void fetchState(), 5000);
    return () => clearInterval(timer);
  }, []);

  const simulate = async (action: "tick" | "reset") => {
    setSimMessage(action === "tick" ? "Advancing simulation..." : "Resetting demo...");
    try {
      const { advanceSimulation, resetDemoState } = await import("@/lib/demo-store");
      const data = action === "tick" ? advanceSimulation() : resetDemoState();
      setState(data);
      setSimMessage(action === "tick" ? "" : "System reset complete.");
      if (action === "reset") setTimeout(() => setSimMessage(""), 3000);
    } catch (err) {
      setSimMessage("Simulation error.");
    }
  };

  if (error) return <div className="p-20 text-center text-[#BC4A3C]">{error}</div>;
  if (!state) return <div className="p-20 text-center text-[#8B9E91] italic">Syncing with reserve...</div>;

  const topAlert = state.alerts[0];
  const topSighting = state.sightings[0];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050A07] text-[#FFFFFF] selection:bg-[#FFB800]/30 selection:text-white">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-[#FFFFFF]/5 p-8 overflow-y-auto">
        <div className="mb-12">
          <div className="h-10 w-10 rounded bg-[#FFB800]/20 flex items-center justify-center border border-[#FFB800]/30 mb-4 shadow-[0_0_15px_rgba(255,184,0,0.15)]">
            <Settings className="w-5 h-5 text-[#FFB800]" />
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Digital Jungle</h1>
          <p className="text-xs tracking-wider text-[#8B9E91] uppercase mt-1">Management Node</p>
        </div>

        <nav className="space-y-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                item.active 
                  ? "bg-[#FFB800]/10 text-[#FFB800] font-bold border border-[#FFB800]/10 shadow-[0_4px_20px_rgba(255,184,0,0.05)]" 
                  : "text-[#8B9E91] hover:text-[#FFFFFF] hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </nav>

        {isAdmin && (
          <div className="mt-8 pt-8 border-t border-[#FFFFFF]/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B9E91] font-bold mb-4">Simulator Core</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => void simulate("tick")} className="safari-button text-xs w-full">
                Advance Simulation
              </button>
              <button onClick={() => void simulate("reset")} className="safari-button-secondary text-xs w-full">
                System Reset
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest font-bold text-[#FFB800] h-4">{simMessage}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="p-8 lg:px-10 lg:py-8 border-b border-[#FFFFFF]/5 flex flex-col gap-6 lg:flex-row lg:items-end justify-between bg-[#050A07]/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-4xl text-white font-serif mb-2">UnPlugged Operations</h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#00D166] animate-pulse shadow-[0_0_12px_rgba(0,209,102,0.8)]" />
              <p className="text-sm font-medium text-[#8B9E91]">System Syncing: Live</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 lg:items-end mix-blend-screen text-right">
             <p className="text-xs text-[#FFB800] uppercase tracking-widest font-bold">Current Environment</p>
             <p className="text-sm text-[#FFFFFF]">{state.weather.temperatureC}°C • {state.weather.condition}</p>
             <p className="text-xs text-[#8B9E91] font-mono">{new Date().toLocaleTimeString()} / Node Alpha-9</p>
          </div>
        </header>

        <div className="p-8 lg:p-10 flex flex-col gap-8 flex-1">
          <StatsGrid state={state} isVisitor={isVisitor} />

          <div className="grid gap-8 lg:grid-cols-4 flex-1">
            <div className="lg:col-span-3 flex flex-col gap-8">
              {/* Live Map Panel */}
              <div className="glass-panel overflow-hidden min-h-[400px] lg:h-[600px]">
                 <MapView state={state} />
              </div>

              {/* Event Modules */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Activity Feed */}
                <div className="glass-panel p-6 h-80 overflow-hidden flex flex-col">
                   <h3 className="text-lg font-bold text-white mb-4">Operations Log</h3>
                   <div className="flex-1 overflow-y-auto pr-2">
                      <EventTicker state={state} />
                   </div>
                </div>

                {/* Animal Detection Panel */}
                <div className="glass-panel p-6">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">Detection Matrix</h3>
                      <div className="px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 text-[10px] font-bold text-[#FFB800] uppercase tracking-widest shadow-[0_0_10px_rgba(255,184,0,0.1)]">
                        ESP32-CAM Feed
                      </div>
                   </div>
                   {topSighting ? (
                     <div className="relative overflow-hidden rounded-xl bg-[#0B130E] border border-white/5 h-48 group">
                        {/* Placeholder for camera image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050A07] to-transparent z-10" />
                        <div className="absolute inset-0 opacity-40 bg-[#00D166]/20 mix-blend-screen" />
                        <div className="absolute bottom-4 left-4 z-20">
                          <p className="text-xl font-bold text-white tracking-wide">{topSighting.species}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="bg-[#00D166] text-[#050A07] text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-[0_0_8px_rgba(0,209,102,0.5)]">
                               {Math.round(topSighting.confidence * 100)}% CONF
                             </div>
                             <span className="text-xs text-[#8B9E91] font-mono">{fmtTime(topSighting.capturedAt)}</span>
                          </div>
                          <p className="text-xs text-[#FFFFFF] mt-2 flex items-center gap-1">
                            <Map className="w-3 h-3 text-[#FFB800]" /> {zoneName(state, topSighting.zoneId)}
                          </p>
                        </div>
                     </div>
                   ) : (
                     <p className="text-sm text-[#8B9E91] italic pt-8 text-center">No active biological signatures detected.</p>
                   )}
                </div>
              </div>
            </div>

            {/* Right Column / Side Panels */}
            <aside className="space-y-8 lg:col-span-1">
               {isOperator && <ZoneSummary state={state} />}
               {isVisitor && <BookingForm state={state} onBookingCreated={fetchState} />}
               <WeatherCard weather={state.weather} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
