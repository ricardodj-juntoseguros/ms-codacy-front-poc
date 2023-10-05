import { PolicyholderDTO } from '../application/types/dto';

export const getPolicyholderForInsuredUserMock = [
  {
    externalPolicyholderId: 1,
    federalId: '33768864000107',
    corporateName: 'TOMADOR 1',
  },
  {
    externalPolicyholderId: 2,
    federalId: '41046285000189',
    corporateName: 'TOMADOR 2',
  },
  {
    externalPolicyholderId: 3,
    federalId: '07753250000141',
    corporateName: 'TOMADOR 3',
  },
  {
    externalPolicyholderId: 4,
    federalId: '18362844000148',
    corporateName: 'TOMADOR 4',
  },
] as PolicyholderDTO[];
