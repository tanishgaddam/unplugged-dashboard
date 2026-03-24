import { useState } from "react";
import { SafariState, Booking } from "@/lib/types";
import { Ticket, User, Clock, CheckCircle2, QrCode } from "lucide-react";

export function BookingForm({
  state,
  onBookingCreated,
}: {
  state: SafariState;
  onBookingCreated: (booking: Booking) => void;
}) {
  const [visitorName, setVisitorName] = useState("");
  const [slotId, setSlotId] = useState(state.slots[0]?.id || "");
  const [ticketCount, setTicketCount] = useState(2);
  const [bookingMessage, setBookingMessage] = useState("");
  const [highlightedBooking, setHighlightedBooking] = useState<Booking | null>(null);

  const submitBooking = async () => {
    if (!visitorName) {
      setBookingMessage("Please enter a name.");
      return;
    }
    setBookingMessage("Issuing secure pass...");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ visitorName, slotId, ticketCount }),
      });
      const data = (await response.json()) as { booking: Booking };
      setHighlightedBooking(data.booking);
      onBookingCreated(data.booking);
      setBookingMessage(`Pass ${data.booking.id} confirmed.`);
      setVisitorName("");
    } catch (err) {
      setBookingMessage("Protocol failure. Retry.");
    }
  };

  return (
    <div className="space-y-8 glass-panel p-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Ticket className="h-5 w-5 text-[#FFB800]" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B9E91] font-bold">Ticketing System</p>
        </div>
        <h3 className="text-2xl font-light text-white italic">Reserve <span className="font-semibold text-[#FFB800]">Safari Pass</span></h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-bold text-[#8B9E91] uppercase tracking-widest pl-1">
            <User className="h-3 w-3" />
            Visitor Identity
          </label>
          <input
            value={visitorName}
            onChange={(event) => setVisitorName(event.target.value)}
            className="w-full rounded-xl border border-white/5 bg-[#050A07]/40 px-5 py-4 text-sm text-white outline-none ring-1 ring-white/5 transition-all focus:ring-[#FFB800]/50 focus:bg-[#050A07]/80"
            placeholder="Official full name"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-bold text-[#8B9E91] uppercase tracking-widest pl-1">
            <Clock className="h-3 w-3" />
            Chronos Slot
          </label>
          <div className="relative">
            <select
              value={slotId}
              onChange={(event) => setSlotId(event.target.value)}
              className="w-full appearance-none rounded-xl border border-white/5 bg-[#050A07]/40 px-5 py-4 text-sm text-[#FFFFFF] outline-none ring-1 ring-white/5 transition-all focus:ring-[#FFB800]/50 focus:bg-[#050A07]/80"
            >
              {state.slots.map((slot) => (
                <option key={slot.id} value={slot.id} className="bg-[#050A07] text-[#FFFFFF]">
                  {slot.startTime} · {slot.booked}/{slot.allocatedCapacity} Booked
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#8B9E91]">
              <div className="h-0 w-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-current" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-bold text-[#8B9E91] uppercase tracking-widest pl-1">
            <Ticket className="h-3 w-3" />
            Seat Allocation
          </label>
          <input
            type="number"
            min={1}
            max={6}
            value={ticketCount}
            onChange={(event) => setTicketCount(Number(event.target.value))}
            className="w-full rounded-xl border border-white/5 bg-[#050A07]/40 px-5 py-4 text-sm text-[#FFFFFF] outline-none ring-1 ring-white/5 transition-all focus:ring-[#FFB800]/50 focus:bg-[#050A07]/80"
          />
        </div>

        <button
          type="button"
          onClick={() => void submitBooking()}
          className="group relative w-full overflow-hidden safari-button"
        >
          <span className="relative z-10 text-sm font-bold tracking-wide">GENERATE SECURE PASS</span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>

        <div className="flex items-start gap-3 rounded-xl bg-[#050A07]/30 border border-[#FFFFFF]/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] p-4">
          <div className="h-2 w-2 rounded-full bg-[#00D166]/60 mt-1.5 shadow-[0_0_8px_rgba(0,209,102,0.6)]" />
          <p className="text-[10px] leading-relaxed text-[#8B9E91] font-medium tracking-wide">
            {bookingMessage || "Each pass is cryptographically signed and linked to a physical tag for gate access."}
          </p>
        </div>
      </div>

      {highlightedBooking && (
        <div className="p-6 rounded-xl border border-[#00D166]/30 bg-[#00D166]/10 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-[inset_0_0_20px_rgba(0,209,102,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="h-5 w-5 text-[#00D166]" />
            <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-[#00D166]">Verification Passed</span>
          </div>
          <p className="text-[10px] font-bold text-[#8B9E91] uppercase tracking-widest leading-none mb-2">Electronic Credentials</p>
          <h4 className="text-xl font-bold text-[#FFFFFF] mb-4">{highlightedBooking.id}</h4>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#00D166]/20">
            <div>
              <p className="text-[8px] font-bold text-[#8B9E91] uppercase mb-1">Passowner</p>
              <p className="text-xs font-bold text-[#FFFFFF]">{highlightedBooking.visitorName}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-[#8B9E91] uppercase mb-1">Seats</p>
              <p className="text-xs font-bold text-[#FFFFFF]">{highlightedBooking.ticketCount} Units</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-3 bg-[#050A07] p-3 rounded-xl border border-white/5">
            <QrCode className="h-4 w-4 text-[#8B9E91]" />
            <code className="text-[10px] font-mono text-[#00D166] truncate">HASH_{highlightedBooking.qrCode}</code>
          </div>
        </div>
      )}
    </div>
  );
}
