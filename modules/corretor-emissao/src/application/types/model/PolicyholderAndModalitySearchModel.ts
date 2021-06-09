import { PolicyholderModel } from './PolicyholderModel';
import { SubsidiaryModel } from './SubsidiaryModel';
import { ModalityModel } from './ModalityModel';

export interface PolicyholderAndModalitySearchModel {
  policyholderOptions: PolicyholderModel[];
  loadingSearchPolicyholder: boolean;
  modalityOptions: ModalityModel[];
  loadingGetModalities: boolean;
  subsidiaryOptions: SubsidiaryModel[];
  loadingDetails: boolean;
}
