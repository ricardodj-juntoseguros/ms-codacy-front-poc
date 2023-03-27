import { MappingStatusEnum } from './MappingStatusEnum';

export interface MappingRequestsListSettingsModel {
  mappingStatus: MappingStatusEnum;
  activePage: number;
  pageSize: number;
}
