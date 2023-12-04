export function cpfFormatter(valueToFormat: string): string {
  const cpf = valueToFormat.trim().replace(/[./-]/g, '');
  const reg = new RegExp('^[0-9]+$');
  if (!cpf) return '';
  if (!reg.test(cpf) || cpf.length > 11) {
    return cpf
      .slice(0, -1)
      .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}
