export function policyNumberFormatter(policyNumber: string) {
  if (!policyNumber) return '';
  return policyNumber.replace(/^(\d{2})(\d{4})(\d{7})/, '$1-$2-$3');
}
