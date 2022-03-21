import { OpportunityRelevanceEnum } from '../model';

export interface OpportunityDetailsItemDTO {
  relevance: OpportunityRelevanceEnum;
  type: string;
  category: string;
  securityAmount: number;
  policyholder: string;
  expiration: string;
  mappingDate: string;
}
