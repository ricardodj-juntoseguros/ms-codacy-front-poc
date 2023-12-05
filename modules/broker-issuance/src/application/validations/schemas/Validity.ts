import {
  format,
  isAfter,
  isEqual,
  isSameDay,
  isValid,
  startOfDay,
  subDays,
} from 'date-fns';
import { object, string } from 'yup';
import { parseStringToDate } from '../../../helpers';

export const ValiditySchema = object().shape({
  validityStartDate: string()
    .required()
    .test('invalidDate', function validDate() {
      const { validityStartDate, validStartDate } = this.parent;
      if (!validStartDate) return true;
      return isValid(parseStringToDate(validityStartDate));
    })
    .test(
      'initialValidityMaxRetroactive',
      function initialValidityMaxRetroactive() {
        const { validityStartDate, retroactiveDays, validStartDate } =
          this.parent;
        if (!validStartDate) return true;
        const parsedInitialValidity = parseStringToDate(validityStartDate);
        const maxRetroactiveDate = startOfDay(
          subDays(new Date(), retroactiveDays),
        );
        return (
          isSameDay(parsedInitialValidity, maxRetroactiveDate) ||
          isAfter(parsedInitialValidity, maxRetroactiveDate)
        );
      },
    ),
  validityEndDate: string()
    .required()
    .test('invalidDate', function validDate() {
      const { validityEndDate, validEndDate } = this.parent;
      if (!validEndDate) return true;
      return isValid(parseStringToDate(validityEndDate));
    })
    .test('invalidValidityRange', function endValidityIsAfter() {
      const {
        validityStartDate,
        validityEndDate,
        validStartDate,
        validEndDate,
      } = this.parent;
      const parsedInitialValidity = parseStringToDate(validityStartDate);
      const parsedEndValidity = parseStringToDate(validityEndDate);
      if (!validStartDate || !validEndDate) return true;
      return !(
        isAfter(parsedInitialValidity, parsedEndValidity) ||
        isEqual(parsedInitialValidity, parsedEndValidity)
      );
    })
    .test('endValidityLessThanToday', function endValidityIsAfter() {
      const { validityEndDate, validEndDate } = this.parent;
      if (!validEndDate) return true;
      const parsedEndValidity = parseStringToDate(validityEndDate);
      const parsedNowDate = startOfDay(
        parseStringToDate(format(new Date(), 'dd/MM/yyyy')),
      );
      return (
        isAfter(parsedEndValidity, parsedNowDate) ||
        isSameDay(parsedEndValidity, parsedNowDate)
      );
    }),
});
