export function stringToInt(strValue: string): number {
  const strippedValue = strValue.replace(/[^\d.,]+/, '');
  return Number.parseInt(strippedValue, 10);
}
