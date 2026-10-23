export type Locale = 'bn' | 'en';

export function formatNumber(value: number, locale: Locale) {
  const formatted = new Intl.NumberFormat(
    locale === 'bn' ? 'en-IN' : 'en-US',
  ).format(value);
  if (locale === 'en') return formatted;
  // Some device runtimes use Latin digits even for bn-BD; make our Bangla choice explicit.
  const digits = '০১২৩৪৫৬৭৮৯';
  return formatted.replace(/[0-9]/g, (digit) => digits[Number(digit)]);
}
