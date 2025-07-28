import { NextResponse } from "next/server";

const RATE_LIMIT = 100; // max requêtes
const WINDOW_MS = 15 * 60 * 1000; // 15 min

const ipHits: Record<string, { count: number; last: number }> = {};

export function middleware(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const now = Date.now();
  if (!ipHits[ip] || now - ipHits[ip].last > WINDOW_MS) {
    ipHits[ip] = { count: 1, last: now };
  } else {
    ipHits[ip].count++;
  }
  if (ipHits[ip].count > RATE_LIMIT) {
    return new NextResponse("Trop de requêtes", { status: 429 });
  }
  return NextResponse.next();
}
