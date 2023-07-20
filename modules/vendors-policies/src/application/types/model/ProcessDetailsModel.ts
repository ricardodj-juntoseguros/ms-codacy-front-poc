import { ProcessDetailDTO } from '../dto/ProcessDetailDTO';

export interface ProcessDetailsModel extends ProcessDetailDTO {
  policyholderFederalIdFormatted: string;
  securedAmountFormatted: string;
  netPrizeFormatted?: string;
  initialValidityFormatted: string;
  endValidityFormatted: string;
}
