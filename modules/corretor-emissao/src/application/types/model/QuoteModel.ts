import { ContractDataModel } from './ContractDataModel';
import { InstallmentModel } from './InstallmentModel';
import { ModalityModel } from './ModalityModel';
import { PolicyholderModel } from './PolicyholderModel';
import { PricingModel } from './PricingModel';
import { SubsidiaryModel } from './SubsidiaryModel';
import { TimeframeAndCoverageModel } from './TimeframeAndCoverageModel';

export interface QuoteModel {
  policyholder: PolicyholderModel | null;
  modality: ModalityModel | null;
  subsidiary: SubsidiaryModel | null;
  timeframeAndCoverage?: TimeframeAndCoverageModel | null;
  contractData: ContractDataModel;
  pricing: PricingModel;
  installments: InstallmentModel[];
}
