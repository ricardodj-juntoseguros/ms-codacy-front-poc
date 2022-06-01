import { parse, startOfDay } from 'date-fns';

export function parseStringToDate(value: string) {
  return startOfDay(parse(value, 'dd/MM/yyyy', new Date()));
}
