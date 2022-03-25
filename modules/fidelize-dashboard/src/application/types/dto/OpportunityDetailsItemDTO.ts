import { OpportunityRelevanceEnum } from '../model';

export interface OpportunityDetailsItemDTO {
  id: string;
  relevance: OpportunityRelevanceEnum;
  type: string;
  category: string;
  securityAmount: number;
  policyholder: string;
  expiration: string | null;
  mappingDate: string;
}
