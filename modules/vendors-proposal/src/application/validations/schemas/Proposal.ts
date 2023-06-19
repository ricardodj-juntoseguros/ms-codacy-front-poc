import { array, boolean, number, object, string } from 'yup';

export const ProposalSchema = object().shape({
  policyholderFederalId: string().required(),
  policyholderAffiliateFederalId: string().notRequired(),
  insuredFederalId: string().required(),
  insuredAddressId: number().required(),
  modalityId: number().required(),
  subModalityId: number().required(),
  validityStartDate: string().required(),
  validityDurationInDays: number().required(),
  securedAmount: number().required(),
  additionalLaborCoverage: boolean().notRequired(),
  contacts: array().min(1).required(),
});
