export function thousandSeparator(
  x: number | null,
  separator = '.',
  decimalDigits = 0,
  locale = 'pt-BR',
): string | null {
  if (x === null) return null;
  const str = Number(x.toFixed(decimalDigits)).toLocaleString(locale, {
    minimumFractionDigits: decimalDigits,
  });
  return str.replace(/\./g, separator);
}
