// Simple in-memory rate limiter (per IP if available, else global)
const RATE_LIMIT = 30; // requests
const WINDOW_MS = 60 * 1000; // 1 minute
const ipHits: Record<string, { count: number; windowStart: number }> = {};
let globalHits = { count: 0, windowStart: Date.now() };
function getClientIp(req: NextRequest): string | null {
  // Try to get IP from headers (works on Vercel/Next.js edge)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return ip || null;
}
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { $Enums } from '@prisma/client';
import { normalizeLocation } from '@/lib/utils';

const QuerySchema = z.object({
  bloodGroup: z.string().min(1),
  location: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
  seed: z.string().optional(),
});

function seededShuffle<T>(array: T[], seed: string | undefined): T[] {
  if (!seed) {
    // Use Math.random() if no seed
    return array.sort(() => Math.random() - 0.5);
  }
  // Simple LCG for deterministic shuffling
  let s = 0;
  for (let i = 0; i < seed.length; i++) s += seed.charCodeAt(i);
  let rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET(req: NextRequest) {
  // --- Rate limiting logic ---
  const ip = getClientIp(req);
  const key = ip || 'global';
  const now = Date.now();
  if (ip) {
    if (!ipHits[key] || now - ipHits[key].windowStart > WINDOW_MS) {
      ipHits[key] = { count: 1, windowStart: now };
    } else {
      ipHits[key].count++;
    }
    if (ipHits[key].count > RATE_LIMIT) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute and try again.' }, { status: 429 });
    }
  } else {
    // Fallback to global rate limit
    if (now - globalHits.windowStart > WINDOW_MS) {
      globalHits = { count: 1, windowStart: now };
    } else {
      globalHits.count++;
    }
    if (globalHits.count > RATE_LIMIT) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute and try again.' }, { status: 429 });
    }
  }
  // --- End rate limiting ---
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const parse = QuerySchema.safeParse(params);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid query', issues: parse.error.issues }, { status: 400 });
  }
  const { bloodGroup, location, limit, seed } = parse.data;
  const normLocation = normalizeLocation(location);
  // Prisma v6 does not support 'mode: insensitive', so fetch all with bloodGroup and filter in JS
  const allDonors = await prisma.donor.findMany({
    where: { bloodGroup: bloodGroup as $Enums.BloodGroup },
  });
  // No logging of phone numbers for privacy
  const donors = allDonors.filter(d => normalizeLocation(d.location).includes(normLocation));
  type Donor = typeof donors[number];
  const shuffled = seededShuffle(donors, seed);
  const safeDonors = shuffled.slice(0, limit).map((d: Donor) => ({
    id: d.id,
    name: d.name,
    bloodGroup: d.bloodGroup,
    location: d.location,
    phone: d.phone,
    createdAt: d.createdAt,
  }));
  return NextResponse.json({ donors: safeDonors });
}
