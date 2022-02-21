export function thousandSeparator(
  x: number | null,
  separator = '.',
): string | null {
  if (x === null) return null;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
