// Amounts are stored as whole paisa. No floating-point multiplication or rounding.
export function latinDigits(value: string) {
  return value
    .trim()
    .replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)));
}

export function parsePaisa(value: string): number | undefined {
  const text = latinDigits(value);
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return undefined;
  const [whole, fraction = ''] = text.split('.');
  const significant = whole.replace(/^0+/, '') || '0';
  if (significant.length > 14) return undefined;
  const amount = BigInt(significant) * 100n + BigInt(fraction.padEnd(2, '0'));
  return amount <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(amount) : undefined;
}

export function paisaInput(value: number) {
  const amount = BigInt(value);
  return `${amount / 100n}.${String(amount % 100n).padStart(2, '0')}`;
}

export function formatPaisa(value: number, locale: 'bn' | 'en') {
  const [whole, fraction] = paisaInput(value).split('.');
  let text = new Intl.NumberFormat(locale === 'bn' ? 'en-IN' : 'en-US').format(
    Number(whole),
  );
  if (fraction !== '00') text += `.${fraction}`;
  if (locale === 'bn')
    text = text.replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);
  return `${locale === 'bn' ? '৳' : 'BDT'} ${text}`;
}
