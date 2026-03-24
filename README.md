# Smart Safari Control Grid

Submission-ready IoT software prototype for the `Unplugged 2026` jungle safari problem statement. The app combines safari ticketing, dynamic slot allocation, live vehicle monitoring, telemetry ingestion, wildlife sightings, and conservation-oriented admin analytics in one Next.js demo.

## What is implemented

- Visitor booking flow with dynamic seat allocation and generated `QR` / `RFID` pass details
- Operator and admin views for vehicle readiness, reserve activity, alerts, sightings, and live telemetry
- Device-compatible ingestion API for `GPS`, `RFID`, `IR`, `ESP32-CAM`, and system heartbeat payloads
- Simulation controls for advancing or resetting the live safari scenario without hardware
- Dynamic slot allocator that reacts to zone load and vehicle activity
- Test coverage for booking creation, telemetry updates, and simulation behavior

## Project structure

- `src/app/` app routes and API endpoints
- `src/components/dashboard-client.tsx` main safari control-room UI
- `src/lib/demo-store.ts` in-memory demo backend, allocator, simulator, and telemetry normalization
- `src/lib/types.ts` shared domain contracts for slots, vehicles, bookings, alerts, and telemetry

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful routes:

- `/` overview
- `/visitor` visitor-focused booking view
- `/operator` operator-focused route supervision view
- `/admin` admin-focused conservation and capacity view

## API endpoints

- `GET /api/state` current live safari state
- `POST /api/bookings` create a booking
- `POST /api/telemetry` ingest device-compatible telemetry
- `POST /api/simulate` advance or reset the safari simulation

Example telemetry payload:

```json
{
  "kind": "camera",
  "sourceId": "esp32-cam-01",
  "vehicleId": "veh-1",
  "zoneId": "north-canopy",
  "message": "ESP32-CAM detected movement",
  "payload": {
    "species": "Leopard",
    "confidence": 0.91
  }
}
```

## Verification

```bash
npm test
npm run lint
npm run build
```

## PPT mapping

- Overview / highlighted problems: live reserve pressure, fragmented tracking, manual capacity issues
- Solution blueprint: unified booking + telemetry + conservation control platform
- Technical approach: Next.js frontend, API routes, simulation engine, device-compatible payload model
- System architecture: visitor app, operator/admin control room, telemetry ingestion layer, allocator, live state store
- Operational challenges: zone congestion, delayed vehicles, sensor noise, partial hardware availability
- Impact and benefits: lower crowd pressure, better visitor flow, stronger conservation visibility
