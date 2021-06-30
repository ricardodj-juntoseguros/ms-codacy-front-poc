import { parse, startOfDay, isValid } from 'date-fns';

export function parseStringToDate(value: string) {
  const isValidDate = isValid(parse(value, 'dd/MM/yyyy', new Date()));

  if (isValidDate) {
    return startOfDay(parse(value, 'dd/MM/yyyy', new Date()));
  }

  return null;
}
