import { OpportunitiesDetailsSettingsModel } from '.';
import { OpportunityDetailsItemDTO } from '../dto';

export interface OpportunitiesDetailsModel {
  settings: OpportunitiesDetailsSettingsModel[];
  selectedOpportunities: OpportunityDetailsItemDTO[];
}
