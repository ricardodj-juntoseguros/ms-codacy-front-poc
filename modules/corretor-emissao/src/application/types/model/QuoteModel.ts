import { ModalityModel } from './ModalityModel';
import { PolicyholderModel } from './PolicyholderModel';
import { SubsidiaryModel } from './SubsidiaryModel';
import { TimeframeAndCoverageModel } from './TimeframeAndCoverageModel';

export interface QuoteModel {
  policyholder: PolicyholderModel | null;
  modality: ModalityModel | null;
  subsidiary: SubsidiaryModel | null;
  timeframeAndCoverage?: TimeframeAndCoverageModel | null;
}
