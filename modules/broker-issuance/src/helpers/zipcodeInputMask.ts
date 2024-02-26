import { zipcodeFormatter } from '@shared/utils';

export function zipcodeInputMask(numericValue: string): string {
  let valueToSet = numericValue;
  if (valueToSet.length > 8) {
    valueToSet = valueToSet.substring(0, 8);
  }
  if (numericValue.length === 5) valueToSet.replace('-', '');
  if (numericValue.length >= 6) valueToSet = zipcodeFormatter(valueToSet);

  return valueToSet;
}
