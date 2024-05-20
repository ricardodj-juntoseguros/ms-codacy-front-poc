import { BrokerPlatformAuthService, ProfileEnum } from '@services';

export const additionalCoverageSummaryAdapter = (
  labor: boolean,
  rateAggravation: boolean,
) => {
  const result = [] as { key: string; label: string; value: string }[];
  const profile = BrokerPlatformAuthService.getUserProfile();

  if (labor && profile === ProfileEnum.POLICYHOLDER) {
    result.push({
      key: 'labor',
      label: 'Cobertura trabalhista',
      value: 'Sim',
    });
  }

  if (labor && profile !== ProfileEnum.POLICYHOLDER) {
    result.push({
      key: 'labor',
      label: 'Cobertura trabalhista',
      value: rateAggravation ? 'Com agravo de 50%' : 'Sem agravo',
    });
  }

  return result;
};
