export function thousandTextFormatter(
  value: number | null,
  prefix = '',
  suffix = '',
  format: 'full' | 'short' = 'full',
) {
  const fullLabels = [
    ' mil',
    ' milhões',
    ' bilhões',
    ' trilhões',
    ' quatrilhões',
    ' quintilhões',
  ];
  const shortLabels = ['K', 'MM', 'B', 'T', 'Qa', 'Qi'];
  let auxValue = value || 0;
  let thousandCounter = 0;
  while (auxValue / 1000 >= 1) {
    auxValue /= 1000;
    thousandCounter += 1;
  }

  let formattedValue = auxValue.toFixed(2).replace('.', ',');
  // strip trailing zeros if number is integer
  formattedValue = formattedValue.replace(',00', '');
  // strip trailing zero on decimal part
  if (formattedValue.includes(',') && formattedValue.endsWith('0'))
    formattedValue = formattedValue.slice(0, formattedValue.length - 1);
  const labels = format === 'full' ? fullLabels : shortLabels;
  const label = thousandCounter === 0 ? '' : `${labels[thousandCounter - 1]}`;
  const formattedText = `${prefix}${formattedValue}${label}${suffix}`;
  return formattedText;
}
