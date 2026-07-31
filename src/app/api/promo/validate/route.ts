import { NextRequest, NextResponse } from 'next/server';
import { validatePromoCode } from '@/lib/promo';

export async function POST(request: NextRequest) {
  const body: { code?: string } = await request.json();

  if (!body.code) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const promo = await validatePromoCode(body.code);

  if (!promo) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, code: promo.code, percentOff: promo.percentOff, label: promo.label });
}
