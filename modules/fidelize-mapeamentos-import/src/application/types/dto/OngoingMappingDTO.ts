export interface OngoingMappingDTO {
  numberOfRecords: number;
  hasMore: boolean;
  hasPrevious: boolean;
  pageNumber: number;
  pageSize: number;
  records: OngoingMappingRecord[];
}

export interface OngoingMappingRecord {
  id: number;
  policyholderFederalId: string;
  policyholderName: string;
  policyholderEconomicGroupName?: string;
  brokerFederalId?: string;
  brokerName?: string;
  category: string;
  createdAt: string;
  isPriority: boolean;
  statusId: number;
  statusDescription: string;
  queueTypes: QueueType[];
  rowsCount: number;
}

export interface QueueType {
  id: number;
  name: string;
  quantity: number;
  requested: boolean;
}
