import { Infer, v } from 'convex/values';

export const currencyCodes = [
  'eur', // Euro first as most widely used
  'aud',
  'cad',
  'chf',
  'dkk',
  'gbp',
  'nok',
  'nzd',
  'sek',
  'usd',
] as const;

export const currencyCode = v.union(...currencyCodes.map(v.literal));

export type CurrencyCode = Infer<typeof currencyCode>;

export const currencyCodeOptions = currencyCodes.map((code) => ({
  value: code,
  label: code.toUpperCase(),
}));
