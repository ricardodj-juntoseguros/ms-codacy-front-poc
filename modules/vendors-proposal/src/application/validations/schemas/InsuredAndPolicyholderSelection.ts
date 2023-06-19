import { object, number, mixed } from 'yup';

export const InsuredAndPolicyholderSelectionSchema = object().shape({
  insuredFederalId: number().required(),
  insuredAddressId: number().required(),
  policyholder: mixed().required(),
});
