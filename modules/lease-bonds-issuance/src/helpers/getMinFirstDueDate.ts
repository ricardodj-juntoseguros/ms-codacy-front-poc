import { addDays, isBefore, startOfDay } from 'date-fns';
import { parseStringToDate } from '@shared/utils';
import { MIN_DAYS_FOR_FIRST_DUE_DATE } from '../constants';

export function getMinFirstDueDate(endDateValidity?: string | null) {
  if (!endDateValidity) return new Date();
  const parsedEndValidity = parseStringToDate(endDateValidity);
  const minDateFromNow = startOfDay(
    addDays(new Date(), MIN_DAYS_FOR_FIRST_DUE_DATE),
  );
  return isBefore(parsedEndValidity, minDateFromNow)
    ? parsedEndValidity
    : minDateFromNow;
}
