import { searchPolicyHolder } from './SearchPolicyholderThunk';
import { getSubsidiaryByPolicyHolder } from './GetSubsidiaryByPolicyholderThunk';
import { getModalityByPolicyHolder } from './GetModalityByPolicyholderThunk';

export const policyholderAndModalitySearchThunks = {
  searchPolicyHolder,
  getSubsidiaryByPolicyHolder,
  getModalityByPolicyHolder,
};
