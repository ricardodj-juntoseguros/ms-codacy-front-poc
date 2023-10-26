export interface ProcessDetailDTO {
  identification: {
    proposalid: number;
    policyid: number;
    quotationid: number;
    newquoterid: number;
    policyNumber?: string | undefined;
  };
  createdAt: string;
  dateIssuance?: string | null;
  status: number;
  policyholder: {
    id: number;
    companyName: string;
    federalId: string;
  };
  product: {
    modalityId: number;
    modality: string;
    subModalityId: number;
    subModality: string;
  };
  insured: {
    id: number;
    companyName: string;
    federalId: string;
  };
  securedAmount: number;
  initialValidity: string;
  endValidity: string;
  durationInDays: number;
  contractNumber: string;
  netPrize?: number;
  comission?: number;
  project?: {
    id: string;
    name: string;
  };
}
