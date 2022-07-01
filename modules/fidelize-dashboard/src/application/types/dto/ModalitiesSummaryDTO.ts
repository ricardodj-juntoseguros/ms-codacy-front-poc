import { ModalitySummaryDTO } from "./ModalitySummaryDTO";

export interface ModalitiesSummaryDTO {
  totalOpportunities: number;
  totalInsuredAmount: number;
  totalsModalities: ModalitySummaryDTO[];
}