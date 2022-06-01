import { isAfter, isEqual } from 'date-fns';
import { object, string, number } from 'yup';
import { parseStringToDate } from '../../../../../helpers';
import { VALIDATION_MESSAGES } from '../../../../../constants/validationMessages';

export const CoverageDataSchema = object().shape({
  coverageData: object().shape({
    startDate: string().required(),
    endDate: string()
      .test(
        'minValidity',
        VALIDATION_MESSAGES.minValidity,
        function validateMinValidity() {
          const { startDate, endDate } = this.parent;

          const parsedStartDate = parseStringToDate(startDate);
          const parsedEndDate = parseStringToDate(endDate);

          return !(
            isAfter(parsedStartDate, parsedEndDate) ||
            isEqual(parsedStartDate, parsedEndDate)
          );
        },
      )
      .required(),
    durationInDays: number()
      .test(
        'minDurationInDays',
        VALIDATION_MESSAGES.minDurationInDays,
        function validateMinDurationInDays(value) {
          if (!value) {
            return false;
          }

          return !(value < 1);
        },
      )
      .required(),
    securedAmount: number().required(),
  }),
});
