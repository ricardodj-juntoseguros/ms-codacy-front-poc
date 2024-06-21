export function zipcodeFormatter(valueToFormat: string): string {
  return `${valueToFormat.substring(0, 5)}-${valueToFormat.substring(5, 8)}`;
}
