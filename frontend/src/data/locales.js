import { IN, GB, US } from 'country-flag-icons/react/3x2';

/** Locale + currency options used in header & footer */
export const LOCALES = [
  {
    id: 'in',
    lang: 'English (IN)',
    currency: 'INR',
    symbol: '₹',
    countryCode: 'IN',
    Flag: IN
  },
  {
    id: 'uk',
    lang: 'English (UK)',
    currency: 'GBP',
    symbol: '£',
    countryCode: 'GB',
    Flag: GB
  },
  {
    id: 'us',
    lang: 'English (US)',
    currency: 'USD',
    symbol: '$',
    countryCode: 'US',
    Flag: US
  }
];

export function getLocaleById(id) {
  return LOCALES.find((l) => l.id === id) || LOCALES[0];
}
