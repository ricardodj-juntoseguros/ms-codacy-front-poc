import { boolean, number, object, string } from 'yup';
import { addDays, isAfter, isBefore, isSameDay, parseISO, startOfDay, subDays } from 'date-fns';
import { federalIdValidator } from '@shared/utils';
import { store } from '../../../config/store';
import { VARIANT_RETROACTIVE_DATE_MODALITIES, MAX_DAYS_FOR_FIRST_DUE_DATE } from '../../../constants';

export const CreateQuotationSchema = object().shape({
  policyholder: object().shape({
    federalId: string()
      .required()
      .test('invalidPolicyholderFederalId', function federalIdValid() {
        const { federalId } = this.parent;
        if (!federalId) return false;
        return federalIdValidator(federalId, 'full');
      }),
    affiliateFederalId: string()
      .nullable()
      .notRequired()
      .test('invalidPolicyholderAffiliateFederalId', function federalIdValid() {
        const { affiliateFederalId } = this.parent;
        if (!affiliateFederalId) return true;
        return federalIdValidator(affiliateFederalId, 'full');
      }),
  }),
  modality: object().shape({
    id: number().required(),
    subModalityId: number().required(),
  }),
  validity: object().shape({
    startDate: string()
      .required()
      .test(
        'initialValidityMaxRetroactive',
        function startValidityMaxRetroactive() {
          const { startDate } = this.parent;
          const {
            quote: { modality },
          } = store.getState();
          let retroactiveDays = 1095;
          if (
            modality &&
            modality.retroactiveDays &&
            VARIANT_RETROACTIVE_DATE_MODALITIES.includes(modality.id)
          ) {
            retroactiveDays = modality.retroactiveDays;
          }
          const parsedInitialValidity = parseISO(startDate);
          const maxRetroactiveDate = startOfDay(
            subDays(new Date(), retroactiveDays),
          );
          return (
            isSameDay(parsedInitialValidity, maxRetroactiveDate) ||
            isAfter(parsedInitialValidity, maxRetroactiveDate)
          );
        },
      ),
    durationInDays: number().positive().required(),
  }),
  securedAmount: number().positive().required(),
  numberOfInstallments: number().required(),
  additionalLaborCoverage: boolean().required(),
  firstDueDate: string().optional().nullable().test('invalidFirstDueDate', function validateFirstDueDate() {
    const { validity, firstDueDate } = this.parent;
    const { durationInDays } = validity;
    if (!firstDueDate) return true;
    const daysToAdd =
      durationInDays && durationInDays < MAX_DAYS_FOR_FIRST_DUE_DATE ? durationInDays : MAX_DAYS_FOR_FIRST_DUE_DATE;
    const maxDate = addDays(new Date(), daysToAdd);
    return isBefore(new Date(firstDueDate), maxDate);
  }),
  brokerFederalId: string()
    .required()
    .test('invalidBrokerFederalId', function federalIdValid() {
      const { brokerFederalId } = this.parent;
      return federalIdValidator(brokerFederalId, 'full');
    }),
});
