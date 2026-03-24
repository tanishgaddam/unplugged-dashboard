import { NextRequest, NextResponse } from "next/server";
import { advanceSimulation, resetDemoState } from "@/lib/demo-store";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { action?: "tick" | "reset" };
  const state = body.action === "reset" ? resetDemoState() : advanceSimulation();
  return NextResponse.json(state);
}
