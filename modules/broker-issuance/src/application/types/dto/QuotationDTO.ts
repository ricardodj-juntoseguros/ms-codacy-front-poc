import { PolicyRenewalTypeEnum } from '../model';

export interface QuotationDTO {
  policyholder: {
    federalId?: string;
    affiliateFederalId?: string | null;
  };
  modality: {
    id?: number;
    subModalityId?: number;
  };
  validity: {
    startDate?: string;
    durationInDays?: number | null;
  };
  pricing?: {
    proposalFee: number | null;
    commissionFlex?: number | null;
    feeFlex?: number | null;
  };
  securedAmount?: number;
  numberOfInstallments?: number;
  additionalCoverage: {
    labor: boolean;
    rateAggravation: boolean;
  };
  brokerFederalId?: string;
  firstDueDate?: string | null;
  isQuotationRetake?: boolean;
  renewal: {
    isPolicyInProgress: boolean;
    type: PolicyRenewalTypeEnum;
    mainPolicyNumber: string;
  };
}
