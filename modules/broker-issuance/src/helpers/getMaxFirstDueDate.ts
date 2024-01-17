import { addDays, isBefore, startOfDay } from 'date-fns';
import { parseStringToDate } from '@shared/utils';
import { MAX_DAYS_FOR_FIRST_DUE_DATE } from '../constants';

export function getMaxFirstDueDate(endDateValidity?: string | null): Date {
  if (!endDateValidity) return new Date();
  const parsedEndValidity = parseStringToDate(endDateValidity);
  const maxDateFromNow = startOfDay(
    addDays(new Date(), MAX_DAYS_FOR_FIRST_DUE_DATE),
  );
  return isBefore(parsedEndValidity, maxDateFromNow)
    ? parsedEndValidity
    : maxDateFromNow;
}
