import { SubsidiaryModel } from './SubsidiaryModel';

export interface PolicyholderModel {
  id: number;
  companyName: string;
  federalId: string;
  subsidiaries: SubsidiaryModel[];
}
