export function codSusepFormatter(valueToFormat: string): string {
  const reg = new RegExp('^[0-9]+$')
  if (!valueToFormat) return '';
  if(!reg.test(valueToFormat) || valueToFormat.length > 14) {
    return valueToFormat.slice(0,-1)
  }
  return valueToFormat.replace(
    /^(\d{6})(\d{1})(\d{6})(\d{1})$/,
    '$1.$2.$3-$4',
  );
}
