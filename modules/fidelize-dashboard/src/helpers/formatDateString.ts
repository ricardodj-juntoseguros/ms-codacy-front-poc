import { format as DateFNSFormat } from 'date-fns';
import brLocale from 'date-fns/locale/pt-BR';

export const formatDateString = (dateStr: string, format: string) => {
  return DateFNSFormat(new Date(dateStr), format, {
    locale: brLocale,
  }).toLowerCase();
};
