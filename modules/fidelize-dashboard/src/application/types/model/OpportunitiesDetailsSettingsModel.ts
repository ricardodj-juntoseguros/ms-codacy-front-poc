import { ModalityEnum } from './ModalityEnum';
import { OpportunityDetailsOrderEnum } from './OpportunityDetailsOrderEnum';

export interface OpportunitiesDetailsSettingsModel {
  modality: ModalityEnum;
  activePage: number;
  pageSize: number;
  orderBy: OpportunityDetailsOrderEnum;
  direction: 'asc' | 'desc';
}
