interface InstallmentsDTO {
  number: number;
  dueDate: string;
  mainValue: number;
  installmentValue: number;
}

interface PreApprovalDTO {
  number: number;
  status: number;
  user: string;
  startDate: string;
  endDate: string;
  firstDueDate: string;
  durationInDays: number;
  securedAmount: number;
  securedIncreasePercentage: null;
  securedAmountWithoutIncrease: null;
  biddingNumber: number;
  biddingDescription: null;
  observations: null;
  annualUpdateIndex: null;
  legalAdditional: null;
  documentType: number;
  isPolicyInProgress: boolean;
  hasIrrevocabilityClause: boolean;
  hasMixedPartnershipClause: boolean;
  expiration: string;
  policyholder: {
    id: number;
    federalId: number;
    name: string;
    sectionalId: number;
    producer: {
      id: number;
      name: string;
    };
    branch: null;
    agreementId: number;
  };
  broker: {
    id: number;
    federalId: string;
    name: string;
  };
  insured: {
    id: number;
    federalId: string;
    name: string;
    insuredType: string;
    addressId: number;
  };
  product: {
    modalityId: number;
    modality: string;
    subModalityId: number;
    subModality: string;
  };
  pricing: {
    netPrize: number;
    firstDueDate: string;
    selectedInstallmentOption: {
      numberOfInstallments: number;
      baseDate: string;
      totalPrize: number;
      installments: Array<InstallmentsDTO>;
    };
  };
}

export default PreApprovalDTO;
