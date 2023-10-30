import { InstallmentDTO } from './InstallmentDTO';

export interface PricingDTO {
  netPrize: number;
  baseDate: string;
  fee: number;
  feeStandard: number;
  feeRule: string;
  hasFeeFlex: boolean;
  hasCommissionFlex: boolean;
  feeFlexAggravationPercent: number;
  commissionFee: number;
  commissionFlex: number | null;
  comissionValue: number;
  commissionRule: string;
  reinsuranceRange?: string;
  guarantor: boolean;
  guarantorFederalId?: string;
  paymentType: number;
  matchedRule: string;
  installmentOptions: InstallmentDTO[];
  discount?: number;
  aggravations: [];
  minimumPrizeRule: string;
  additionalCoverage: [];
  reinsuranceContractId?: number;
  hasAdditionalCoverageLabor: boolean;
  hasAdditionalCoverageGuarantee: boolean;
  hasAdditionalCoverageVigilance: boolean;
}
