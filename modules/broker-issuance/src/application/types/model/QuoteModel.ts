import { QuoteResultDTO } from '../dto';
import { SubmodalityDTO } from '../dto/SubmodalityDTO';
import { ModalityModel } from './ModalityModel';
import { PolicyholderAffiliatesModel } from './PolicyholderAffiliatesModel';
import { PolicyholderModel } from './PolicyholderModel';

export interface QuoteModel {
  currentQuote?: QuoteResultDTO | null;
  policyholder: PolicyholderModel | null;
  policyholderAffiliate: PolicyholderAffiliatesModel | null;
  modality: ModalityModel | null;
  submodality: SubmodalityDTO | null;
  startDateValidity?: string | null;
  endDateValidity?: string | null;
  durationInDays?: number | null;
  securedAmount?: number;
  toggleRateFlex?: boolean;
  proposalFee?: number;
  commissionFlex?: number | null;
  feeFlex?: number | null;
  paymentType?: number;
  additionalCoverage?: [];
  hasAdditionalCoverageLabor?: boolean;
  hasAdditionalCoverageGuarantee?: boolean;
  hasAdditionalCoverageVigilance?: boolean;
  loadingQuote?: boolean;
  hasQuoteChanges: boolean;
  isQuoteResume: boolean;
  hasQuoteErrors: boolean;
}
