import { PolicyholderDTO } from "../application/types/dto";

export const policyholderDetailsMock = {
  registrationData: {
    id: 31832,
    newQuoterId: 87904,
    federalId: '97837181000147',
    email: null,
    companyName: 'DEXCO S.A',
    useBill: false,
    invoiceDueDateDay: 30,
    closingReferenceDay: 30,
    economicGroupId: 20428,
    economicGroupName: 'GRUPO DEXCO',
  },
  affiliates: [
    {
      id: 4460,
      companyName: 'DEXCO S.A',
      city: 'BOTUCATU',
      state: 'SP',
      federalId: '97.837.181/0020-00',
    },
  ]
} as PolicyholderDTO;
