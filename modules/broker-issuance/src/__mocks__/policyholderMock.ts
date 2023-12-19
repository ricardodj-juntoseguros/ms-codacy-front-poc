import { PolicyholderModel } from "../application/types/model";

export const policyholderMock: PolicyholderModel = {
  id: 180988,
  newQuoterId: 180988,
  federalId: '91833813000118',
  email: '',
  companyName: 'TOMADOR TESTE – SQUAD DESACOPLAMENTO',
  useBill: true,
  invoiceDueDateDay: 0,
  closingReferenceDay: 0,
  economicGroupId: 1,
  economicGroupName: 'Economic Group 1',
  disabledFeatures: {
    customClauses: false,
    forcedInternalization: false,
    policyInProgress: false,
  }
};
