export interface RequestMappingDTO {
  numberOfRecords: number;
  hasMore: boolean;
  hasPrevious: boolean;
  pageNumber: number;
  pageSize: number;
  records: RequestMappingRecord[] | DoneMappingRecord[];
}

// export interface MappingDoneDetailsDTO {
//   id: number;
//   policyholderFederalId: string;
//   createdAt: string;
//   createdBy: string;
//   isPriority: boolean;
//   blocks: DoneMappingBlock[];
//   queueTypes: DoneDetailsQueueType[];
// }

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
  queueTypes: QueueType[];
  rowsCount: number;
}

export interface QueueType {
  id: number;
  name: string;
  quantity: number;
  requested: boolean;
}

// export interface DoneDetailsQueueType {
//   id: number;
//   name: string;
//   mappedAt: string | null;
//   requested: boolean;
//   totalProcesses: number;
//   totalOpenProcesses: number;
//   totalOpportunities: number;
//   statusId: number;
//   statusDescription: string;
// }

export interface DoneMappingRecord extends RequestMappingRecord {
  mappedAt: string | null;
  totalProcesses: number;
  totalOpenProcesses: number;
  totalOpportunities: number;
  blocks: DoneMappingBlock[];
}

export interface DoneMappingBlock {
  id: number;
  description: string;
}

// export interface DetailsErrorRequest {
//   success: boolean;
//   data: null;
//   errors: DetailsErrors[];
// }

// export interface DetailsErrors {
//   code: string;
//   message: string;
// }
