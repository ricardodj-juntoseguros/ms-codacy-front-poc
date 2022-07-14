import {
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
  OpportunityDetailsCategoryEnum,
} from '../model';

export interface OpportunityDetailsItemDTO {
  id: string;
  relevance: OpportunityRelevanceEnum;
  type: OpportunityDetailsTypeEnum;
  category: OpportunityDetailsCategoryEnum;
  securityAmount: number | null;
  policyholder: string;
  expiration: string | null;
  mappingDate: string;
  expired: boolean;
  observation: string | null;
}
