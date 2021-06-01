import { PolicyholderModel } from './PolicyholderModel';
import { SubsidiaryModel } from './SubsidiaryModel';
import { ModalityModel } from './ModalityModel';

export interface PolicyholderAndModalitySearchModel {
  policyholderOptions: PolicyholderModel[];
  loadingSearchPolicyholder: boolean;
  policyholder: PolicyholderModel | null;
  modalityOptions: ModalityModel[];
  loadingGetModalities: boolean;
  subsidiaryOptions: SubsidiaryModel[];
  subsidiary: SubsidiaryModel | null;
  modality: ModalityModel | null;
  loadingDetails: boolean;
}
