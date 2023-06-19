import { parse, startOfDay } from 'date-fns';

export function parseStringToDate(value: string, format = 'dd/MM/yyyy') {
  return startOfDay(parse(value, format, new Date()));
}
