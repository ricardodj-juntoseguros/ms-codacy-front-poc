import { ProposalStatusEnum } from '../model';

export interface ProposalDTO {
  identification: {
    quotationid: number | string;
    policyid: number | string;
    newquoterid: number | string;
    proposalId: number | string;
    policyNumber?: string;
  };
  status: ProposalStatusEnum;
  insured: {
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
  policyholder: {
    id: number;
    companyName: string;
    federalId: string;
  };
}
