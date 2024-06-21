import { parseStringToDate } from '@shared/utils';
import { format, isAfter, isBefore, isEqual, isValid } from 'date-fns';
import { object, string, number, mixed, boolean } from 'yup';
import { MAX_END_DATE, MIN_INITIAL_DATE } from '../../../constants';

export const WarrantyDataSchema = object().shape({
  initialValidity: string()
    .required()
    .test('invalidDate', function isValidDate() {
      return isValid(parseStringToDate(this.parent.initialValidity));
    })
    .test(
      'initialValidityMaxRetroactive',
      function initialValidityMaxRetroactive() {
        const { initialValidity } = this.parent;

        const parsedInitialValidity = parseStringToDate(initialValidity);

        return !isBefore(parsedInitialValidity, MIN_INITIAL_DATE);
      },
    ),
  endValidity: string()
    .required()
    .test('endValidityIsAfter', function endValidityIsAfter() {
      const { initialValidity, endValidity } = this.parent;

      const parsedInitialValidity = parseStringToDate(initialValidity);
      const parsedEndValidity = parseStringToDate(endValidity);

      return !(
        isAfter(parsedInitialValidity, parsedEndValidity) ||
        isEqual(parsedInitialValidity, parsedEndValidity)
      );
    })
    .test('endValidityLessThanToday', function endValidityIsAfter() {
      const { endValidity } = this.parent;

      const parsedEndValidity = parseStringToDate(endValidity);
      const parsedNowDate = parseStringToDate(format(new Date(), 'dd/MM/yyyy'));

      return !isBefore(parsedEndValidity, parsedNowDate);
    })
    .test('endValidityMax', function endValidityMax() {
      const { endValidity } = this.parent;
      if (!endValidity) return true;

      const parsedEndValidity = parseStringToDate(endValidity);

      return !isAfter(parsedEndValidity, MAX_END_DATE);
    })
    .test('invalidDate', function isValidDate() {
      if (!this.parent.endValidity) return true;
      return isValid(parseStringToDate(this.parent.endValidity));
    }),
  validityInDays: number().required(),
  warrantyPercentage: number().min(1).max(100).required(),
  modality: mixed().test('required', value => Object.keys(value).length !== 0),
  additionalCoverageLabor: boolean().notRequired(),
});
