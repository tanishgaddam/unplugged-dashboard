import { SafariState } from "@/lib/types";
import { percent } from "./utils";

export function StatsGrid({
  state,
  isVisitor,
}: {
  state: SafariState;
  isVisitor: boolean;
}) {
  if (isVisitor) {
    return (
      <div className="mt-10">
        <p className="text-xs uppercase tracking-[0.28em] text-[#8B9E91]">Live visitors on field</p>
        <p className="mt-2 text-5xl font-semibold text-[#FFB800]">{state.metrics.activeVisitors}</p>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-4">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#8B9E91] font-bold">Occupancy</p>
        <p className="mt-2 text-3xl font-semibold text-[#FFFFFF]">{percent(state.metrics.occupancyRate)}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#8B9E91] font-bold">Zone pressure</p>
        <p className="mt-2 text-3xl font-semibold text-[#FFFFFF]">{percent(state.metrics.zonePressure)}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#8B9E91] font-bold">Active visitors</p>
        <p className="mt-2 text-3xl font-semibold text-[#FFFFFF]">{state.metrics.activeVisitors}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#8B9E91] font-bold">Conservation score</p>
        <p className="mt-2 text-3xl font-semibold text-[#00D166]">{state.metrics.conservationScore}</p>
      </div>
    </div>
  );
}
