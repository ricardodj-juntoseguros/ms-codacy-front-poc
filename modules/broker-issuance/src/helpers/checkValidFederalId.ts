export function checkValidFederalId(value: string) {
  const stripped = value.toString().replace(/[^\d]/g, '');
  if (!stripped || stripped.length !== 14) {
    return false;
  }
  return true;
};
