export function currencyFormatter(value: number) {
  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return `${amount}`;
}
