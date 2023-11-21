export interface SummariesQuantitativeByPolicyholderDTO {
  processesFound: ProcessesFound;
  companyName: string;
  federalId: string;
}

export interface ProcessesFound {
  total: number;
  state: number;
  federal: number;
  labor: number;
}
