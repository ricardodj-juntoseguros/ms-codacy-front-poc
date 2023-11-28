import { SubmodalityDTO } from '../dto/SubmodalityDTO';
import { ContractDataModel } from './ContractDataModel';
import { CoverageDataModel } from './CoverageDataModel';
import { IdentificationModel } from './IdentificationModel';
import { InstallmentModel } from './InstallmentModel';
import { LimitModel } from './LimitModel';
import { ModalityModel } from './ModalityModel';
import { PolicyholderAffiliatesModel } from './PolicyholderAffiliatesModel';
import { PolicyholderModel } from './PolicyholderModel';
import { PricingModel } from './PricingModel';

export interface QuoteModel {
  policyholder: PolicyholderModel | null;
  policyholderAffiliate: PolicyholderAffiliatesModel | null;
  policyholderLimit: LimitModel | null;
  modality: ModalityModel | null;
  submodality: SubmodalityDTO | null;
  coverageData: CoverageDataModel;
  contractData: ContractDataModel;
  pricing: PricingModel;
  installments: InstallmentModel[];
  identification: IdentificationModel[] | null;
  loadingQuote: boolean;
  hasQuoteChanges: boolean;
}
