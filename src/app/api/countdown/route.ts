import { NextResponse } from 'next/server';
import { getCountdownPayload } from '@/lib/countdown';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await getCountdownPayload();

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
