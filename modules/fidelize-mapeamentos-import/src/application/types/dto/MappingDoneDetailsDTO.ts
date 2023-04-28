export interface MappingDoneDetailsDTO {
  id: number;
  policyholderFederalId: string;
  createdAt: string;
  createdBy: string;
  isPriority: boolean;
  blocks: DoneDetailsMappingBlock[];
  queueTypes: DoneDetailsQueueType[];
}

export interface DoneDetailsQueueType {
  id: number;
  name: string;
  mappedAt: string | null;
  requested: boolean;
  totalProcesses: number;
  totalOpenProcesses: number;
  totalOpportunities: number;
  statusId: number;
  statusDescription: string;
}

export interface DoneDetailsMappingBlock {
  id: number;
  description: string;
}

export interface DetailsErrorRequest {
  success: boolean;
  data: null;
  errors: DetailsErrors[];
}

export interface DetailsErrors {
  code: string;
  message: string;
}
