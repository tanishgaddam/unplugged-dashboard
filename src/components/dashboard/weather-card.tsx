import { WeatherSnapshot } from "@/lib/types";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";

export function WeatherCard({ weather }: { weather: WeatherSnapshot }) {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.28em] text-[#8B9E91] font-bold">Atmospheric Data</p>
        <div className="h-2 w-2 animate-pulse rounded-full bg-[#00D166] shadow-[0_0_8px_rgba(0,209,102,0.8)]" />
      </div>
      
      <div className="mt-6 flex items-end justify-between">
        <div>
          <h3 className="text-4xl font-light text-[#FFFFFF]">{weather.temperatureC}°C</h3>
          <p className="mt-1 text-lg font-medium text-[#FFB800]">{weather.condition}</p>
        </div>
        <Cloud className="h-12 w-12 text-[#8B9E91]/50" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#050A07]/40 p-3 border border-[#FFFFFF]/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]">
          <Droplets className="h-5 w-5 text-[#8B9E91]" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#8B9E91] font-bold">Humidity</p>
            <p className="text-sm font-medium text-white">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[#050A07]/40 p-3 border border-[#FFFFFF]/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]">
          <Wind className="h-5 w-5 text-[#8B9E91]" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#8B9E91] font-bold">Wind</p>
            <p className="text-sm font-medium text-white">{weather.windKmph} km/h</p>
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-[#8B9E91] font-bold">
        Sensor Grid Alpha-9 · Active
      </p>
    </div>
  );
}
