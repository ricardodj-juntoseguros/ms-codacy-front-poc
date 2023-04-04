export function cpfFormatter(valueToFormat: string): string {
  const reg = new RegExp('^[0-9]+$')
  if (!valueToFormat) return '';
  if(!reg.test(valueToFormat) || valueToFormat.length > 14) {
    return valueToFormat.slice(0,-1)
  }
  return valueToFormat.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4',
  );
}
