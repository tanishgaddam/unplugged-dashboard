import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/demo-store";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      visitorName?: string;
      slotId?: string;
      ticketCount?: number;
    };

    if (!body.visitorName || !body.slotId || !body.ticketCount) {
      return NextResponse.json({ error: "Missing booking fields." }, { status: 400 });
    }

    const booking = createBooking(body as { visitorName: string; slotId: string; ticketCount: number });
    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking." },
      { status: 400 },
    );
  }
}
