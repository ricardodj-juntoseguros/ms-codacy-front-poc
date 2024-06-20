import { PolicyRenewalTypeEnum } from '../model';
import { ProposalDTO } from './ProposalDTO';

export interface ObjectPreviewDTO {
  identification: {
    policyId: number;
  };
  policyholder: {
    federalId?: string;
    affiliateFederalId?: string;
    economicGroupId?: number;
    economicGroupName?: string;
  };
  insured: {
    federalId?: string;
    name?: string;
    type?: {
      id: number;
      description: string;
    };
  };
  modality: {
    modalityId?: number;
    description?: string;
    submodality: {
      submodalityId?: number;
      description?: string;
    };
  };
  proposal: {
    biddingNumber: string;
    biddingDescription: string;
    securedAmount?: number;
    startDate?: string | null;
    endDate?: string | null;
    totalPrize?: number;
  };
  additionalCoverage: {
    labor: boolean;
  };
  renewal: {
    isPolicyInProgress: boolean;
    type: PolicyRenewalTypeEnum;
    mainPolicyNumber: string;
    documentList: ProposalDTO['renewal']['documentList'];
  };
}
