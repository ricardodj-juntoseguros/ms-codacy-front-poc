export const isAffiliateFederalId = (value: string) => {
  const strippedValue = value.replace(/[^\d]+/g, '');
  if (strippedValue.length !== 14) return false;
  const digits = strippedValue.substring(8, 12);
  return digits !== '0001';
};
