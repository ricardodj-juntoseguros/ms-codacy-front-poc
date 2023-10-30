import { isAfter, isEqual, isValid } from 'date-fns';
import { parseStringToDate } from './parseStringToDate';

export function verifyDateIsSameOrBefore(
  initialDate: string,
  finishDate: string,
): boolean | string {
  const parsedStartDate = parseStringToDate(initialDate);
  const parsedEndDate = parseStringToDate(finishDate);

  if (!isValid(parsedStartDate) || !isValid(parsedEndDate)) {
    return 'Invalid date';
  }

  if (
    isAfter(parsedStartDate, parsedEndDate) ||
    isEqual(parsedStartDate, parsedEndDate)
  ) {
    return true;
  }

  return false;
}
