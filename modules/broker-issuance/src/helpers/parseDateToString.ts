import { format } from 'date-fns';

export function parseDateToString(date: Date | null) {
  if (!date) {
    return '';
  }

  return format(date, 'dd/MM/yyyy');
}
