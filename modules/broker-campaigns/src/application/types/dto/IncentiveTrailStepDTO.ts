import { IncentiveTrailStepStatusEnum } from '../model';

export interface IncentiveTrailStepDTO {
  accumulatedValue: number;
  bonus: number;
  isSurprise: boolean;
  dateStartSurprise: string;
  dateEndSurprise: string;
  percentageCompleted: number;
  amountLeft: number;
  status: IncentiveTrailStepStatusEnum;
  hasPayment: boolean;
  paymentAt: string | null;
  expirationDate: string | null;
}
