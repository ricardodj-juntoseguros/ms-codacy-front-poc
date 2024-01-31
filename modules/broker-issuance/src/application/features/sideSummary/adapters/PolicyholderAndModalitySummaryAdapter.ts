import { federalIdFormatter } from '@shared/utils';
import {
  PolicyholderModel,
  PolicyholderAffiliatesModel,
  ModalityModel,
} from '../../../types/model';

export const policyholderAndModalitySummaryAdapter = (
  policyholder: PolicyholderModel | null,
  policyholderAffiliate: PolicyholderAffiliatesModel | null,
  modality: ModalityModel | null,
) => {
  let result = [] as { key: string; label: string; value: string }[];

  if (policyholder) {
    const { companyName, federalId } = policyholder;
    result = [
      ...result,
      {
        key: 'policyholderFederalId',
        label: 'CNPJ',
        value: federalIdFormatter(federalId),
      },
    ];
    if (companyName) {
      result = [
        ...result,
        {
          key: 'policyholderName',
          label: 'Razão Social',
          value: companyName,
        },
      ];
    }
  }

  if (policyholderAffiliate && policyholderAffiliate.federalId !== '') {
    const { federalId } = policyholderAffiliate;
    result = [
      ...result,
      {
        key: 'affiliateFederalId',
        label: 'Filial',
        value: federalId,
      },
    ];
  }

  if (modality) {
    const { label } = modality;
    result = [
      ...result,
      {
        key: 'modality',
        label: 'Modalidade',
        value: label,
      },
    ];
  }

  return result;
};
