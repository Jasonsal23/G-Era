import { randomBytes } from 'crypto';
import { supabaseAdmin } from './supabase';

export interface PromoCode {
  code: string;
  percentOff: number;
  label: string;
}

const PROMO_CODES: Record<string, PromoCode> = {
  GERA10: { code: 'GERA10', percentOff: 10, label: '10% off' },
};

interface PromoCodeRow {
  code: string;
  percent_off: number;
}

export const validatePromoCode = async (rawCode: string): Promise<PromoCode | null> => {
  const code = rawCode.trim().toUpperCase();

  const staticMatch = PROMO_CODES[code];
  if (staticMatch) return staticMatch;

  const { data } = await supabaseAdmin
    .from('promo_codes')
    .select('code, percent_off')
    .eq('code', code)
    .is('used_at', null)
    .single<PromoCodeRow>();

  if (!data) return null;

  return { code: data.code, percentOff: data.percent_off, label: `${data.percent_off}% off` };
};

// Reuses an existing unused code for this email if one exists, otherwise
// mints a new one. Called on newsletter signup.
export const generateOrReusePromoCode = async (email: string): Promise<PromoCode> => {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await supabaseAdmin
    .from('promo_codes')
    .select('code, percent_off')
    .eq('email', normalizedEmail)
    .is('used_at', null)
    .single<PromoCodeRow>();

  if (existing) {
    return { code: existing.code, percentOff: existing.percent_off, label: `${existing.percent_off}% off` };
  }

  const percentOff = 10;
  const code = `GERA10-${randomBytes(4).toString('hex').toUpperCase().slice(0, 6)}`;

  await supabaseAdmin.from('promo_codes').insert({
    code,
    email: normalizedEmail,
    percent_off: percentOff,
  });

  return { code, percentOff, label: `${percentOff}% off` };
};

// Marks a generated code as used after a real payment completes. Guarded by
// used_at is null so a redelivered webhook can't double-consume it — a
// no-op on static codes since they never have a matching row.
export const markPromoCodeUsed = async (code: string, orderId: string): Promise<void> => {
  await supabaseAdmin
    .from('promo_codes')
    .update({ used_at: new Date().toISOString(), used_order_id: orderId })
    .eq('code', code.trim().toUpperCase())
    .is('used_at', null);
};
