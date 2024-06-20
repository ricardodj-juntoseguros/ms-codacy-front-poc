import { PolicyRenewalTypeEnum, RenewalFileTypeEnum } from '../model';

export interface ProposalDTO {
  insured: {
    id: number;
    federalId: string | null;
    addressId: number;
  };
  selectedInstallmentOptions: {
    numberOfInstallments: number;
    paymentType: number;
    firstDueDate: string;
  };
  brokerFederalId: string;
  biddingNumber: string;
  biddingDescription?: string | null;
  contacts?: string[] | null;
  observations?: string | null;
  specialAnalysis: {
    required: boolean;
    description: string;
  };
  renewal: {
    isPolicyInProgress: boolean;
    type: PolicyRenewalTypeEnum;
    mainPolicyNumber: string;
    documentList: {
      type: RenewalFileTypeEnum;
      number: string;
      hasOrdinaryNumbering: boolean;
    }[];
  };
}
