import { ModalityEnum } from '../model';

export interface ModalitySummaryDTO {
  modality: ModalityEnum;
  totalOpportunities: number;
  totalInsuredAmount: number;
  error: boolean;
}
