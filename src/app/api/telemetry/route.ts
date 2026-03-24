import { NextRequest, NextResponse } from "next/server";
import { ingestTelemetry } from "@/lib/demo-store";
import { TelemetryPayload } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelemetryPayload;
    if (!body.kind || !body.sourceId) {
      return NextResponse.json({ error: "Telemetry requires kind and sourceId." }, { status: 400 });
    }
    const event = ingestTelemetry(body);
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to ingest telemetry." },
      { status: 400 },
    );
  }
}
