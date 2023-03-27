import { format as DateFNSFormat, parse } from 'date-fns';
import brLocale from 'date-fns/locale/pt-BR';

export const formatDateString = (dateStr: string, format: string) => {
  return DateFNSFormat(
    parse(dateStr.split('T')[0], 'yyyy-MM-dd', new Date()),
    format,
    {
      locale: brLocale,
    },
  ).toLowerCase();
};
