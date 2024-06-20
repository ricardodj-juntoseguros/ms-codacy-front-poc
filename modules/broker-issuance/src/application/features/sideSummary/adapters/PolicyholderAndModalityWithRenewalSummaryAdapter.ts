import { federalIdFormatter } from '@shared/utils';
import { POLICY_NUMBER_MAX_LENGTH } from '../../../../constants';
import {
  PolicyholderModel,
  PolicyholderAffiliatesModel,
  ModalityModel,
  PolicyRenewalTypeEnum,
} from '../../../types/model';

export const policyholderAndModalityWithRenewalSummaryAdapter = (
  policyholder: PolicyholderModel | null,
  policyholderAffiliate: PolicyholderAffiliatesModel | null,
  modality: ModalityModel | null,
  isPolicyRenewal: boolean,
  policyRenewalType: PolicyRenewalTypeEnum,
  mainPolicyNumber: string,
) => {
  let result = [] as { key: string; label: string; value: string | string[] }[];

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

  if (
    isPolicyRenewal &&
    policyRenewalType !== PolicyRenewalTypeEnum.Undefined
  ) {
    const labels = {
      [PolicyRenewalTypeEnum.OnGoingProcess]: 'Contrato em andamento',
      [PolicyRenewalTypeEnum.BelongsToOurCompany]: [
        'Junto Seguros',
        ` ${
          mainPolicyNumber.length === POLICY_NUMBER_MAX_LENGTH
            ? `\r\n(${mainPolicyNumber})`
            : ''
        }`,
      ],
      [PolicyRenewalTypeEnum.BelongsToAnotherInsuranceCompany]:
        'Outra seguradora ou outra forma de caução',
    };

    result = [
      ...result,
      {
        key: 'isPolicyRenewal',
        label: 'Garantia anterior',
        value: labels[policyRenewalType],
      },
    ];
  }

  return result;
};
