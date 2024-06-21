/* eslint-disable no-plusplus */
export function federalIdValidator(
  value: string,
  validationType: 'partial' | 'full',
) {
  if (validationType === 'partial') {
    // Checks if value has at least one digit, and
    // all characters are digits or dots, forward slashes or dashs
    const hasInvalidCharacters = new RegExp(/[^\d./-]/).test(value);
    const hasAtLeastOneDigit = new RegExp(/\d+/).test(value);
    return !hasInvalidCharacters && hasAtLeastOneDigit;
  }
  if (validationType === 'full') {
    // Checks if the value is:
    // - a string with only digits and 14 characters
    // - a string with only digits and allowed characters,
    //    18 characters and correct format
    // - if above passes, checks the verification digits to validate federalId
    const { length } = value;
    const isPlainNumeric = !new RegExp(/[^\d]/).test(value);
    if (isPlainNumeric && length !== 14) {
      return false;
    }
    if (!isPlainNumeric) {
      const hasInvalidCharacters = new RegExp(/[^\d./-]/).test(value);
      const hasCorrectFormat = new RegExp(
        /^(\d{2})[.](\d{3})[.](\d{3})[/](\d{4})[-](\d{2})$/,
      ).test(value);
      if (hasInvalidCharacters || !hasCorrectFormat) {
        return false;
      }
    }
    const strippedValue = value.replace(/[^\d]+/g, '');
    // Checks if all digits are the same
    if (!new RegExp(/(?!(\d)\1{13})\d{14}/).test(strippedValue)) return false;

    // Validate verification digits
    let size = strippedValue.length - 2;
    let numbers = strippedValue.substring(0, size);
    const digits = strippedValue.substring(size);
    let sum: any = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += Number.parseInt(numbers.charAt(size - i), 10) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number.parseInt(digits.charAt(0), 10)) return false;

    size += 1;
    numbers = strippedValue.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += Number.parseInt(numbers.charAt(size - i), 10) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number.parseInt(digits.charAt(1), 10)) return false;
    return true;
  }
  return false;
}
