export function federalIdFormatter(valueToFormat: string): string {
  const cnpj = valueToFormat.trim().replace(/[./-]/g, '');
  const reg = new RegExp('^[0-9]+$');
  if (!valueToFormat) return '';
  if (!reg.test(cnpj) || cnpj.length > 14) {
    return valueToFormat.slice(0, -1);
  }
  return cnpj
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}
