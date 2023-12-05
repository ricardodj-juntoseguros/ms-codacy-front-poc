import { federalIdValidator } from '@shared/utils';
import { boolean, number, object, string } from 'yup';

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
    startDate: string().required(),
    durationInDays: number().positive().required(),
  }),
  securedAmount: number().positive().required(),
  numberOfInstallments: number().required(),
  additionalLaborCoverage: boolean().required(),
  brokerFederalId: string()
    .required()
    .test('invalidBrokerFederalId', function federalIdValid() {
      const { brokerFederalId } = this.parent;
      return federalIdValidator(brokerFederalId, 'full');
    }),
});
