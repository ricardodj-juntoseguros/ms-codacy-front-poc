import { OpportunityDetailsTypeEnum, OpportunityRelevanceEnum } from '../model';

export interface OpportunityDetailsItemDTO {
  id: string;
  relevance: OpportunityRelevanceEnum;
  type: OpportunityDetailsTypeEnum;
  category: string;
  securityAmount: number;
  policyholder: string;
  expiration: string | null;
  mappingDate: string;
}
