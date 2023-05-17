export interface RequestMappingDTO {
  numberOfRecords: number;
  hasMore: boolean;
  hasPrevious: boolean;
  pageNumber: number;
  pageSize: number;
  records: RequestMappingRecord[] | DoneMappingRecord[];
}
export interface RequestMappingRecord {
  id: number;
  policyholderFederalId: string;
  policyholderName: string;
  policyholderEconomicGroupName?: string;
  brokerFederalId?: string;
  brokerName?: string;
  category: string;
  createdAt: string;
  isPriority: boolean;
  statusId: number | null;
  statusDescription: string;
  blocks: MappingBlocks[];
  queueTypes: QueueType[];
  rowsCount: number;
  canUnlock?: boolean;
}

export interface QueueType {
  id: number;
  name: string;
  quantity: number;
  requested: boolean;
}

export interface DoneMappingRecord extends RequestMappingRecord {
  mappedAt: string | null;
  totalProcesses: number;
  totalOpenProcesses: number;
  totalOpportunities: number;
}

export interface MappingBlocks {
  id: number;
  description: string;
}
