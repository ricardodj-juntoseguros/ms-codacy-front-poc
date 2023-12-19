import { PolicyholderAffiliatesDTO } from './PolicyholderAffiliatesDTO';

export interface PolicyholderDTO {
  registrationData: {
    id: number;
    newQuoterId: number;
    federalId: string;
    email?: string | null;
    companyName: string;
    useBill: boolean;
    invoiceDueDateDay: number;
    closingReferenceDay: number;
    economicGroupId: number;
    economicGroupName: string;
    disabledFeatures: {
      customClauses: boolean;
      forcedInternalization: boolean;
      policyInProgress: boolean;
    }
  };
  affiliates: Array<PolicyholderAffiliatesDTO>;
}
