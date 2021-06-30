import { format } from 'date-fns';

export function parseDateToString(date: Date) {
  return format(date, 'dd/MM/yyyy');
}
