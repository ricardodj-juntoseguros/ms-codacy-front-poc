import { StepStatusEnum } from '@shared/hooks';
import ValidityAndValueCoverageLaborForm from '../../presentation/components/ValidityAndValueCoverageLaborForm';
import InsuredDataServiceProviderWithRenewalForm from '../../presentation/components/InsuredDataServiceProviderWithRenewalForm';
import AdditionalDataCommercialInternalizeForm from '../../presentation/components/AdditionalDataCommercialInternalizeForm';

export const SERVICE_PROVIDER_PERFORMER_STEPS = [
  {
    name: 'ValidityAndValueCoverageForm',
    status: StepStatusEnum.HIDDEN,
    component: ValidityAndValueCoverageLaborForm,
    summaryTitle: 'Vigência e valor',
    title: {
      text: 'Agora, precisamos dos %STRONG% que a garantia irá cobrir',
      boldWords: ['dados de vigência e valor'],
    },
  },
  {
    name: 'InsuredDataServiceProviderWithRenewalForm',
    status: StepStatusEnum.HIDDEN,
    component: InsuredDataServiceProviderWithRenewalForm,
    summaryTitle: 'Dados do segurado e proposta',
    title: {
      text: 'Nessa etapa, indique os %STRONG% que irá fazer parte dessa garantia.',
      boldWords: ['dados do segurado'],
    },
  },
  {
    name: 'AdditionalDataCommercialInternalizeForm',
    status: StepStatusEnum.HIDDEN,
    component: AdditionalDataCommercialInternalizeForm,
    summaryTitle: 'Finalizar emissão',

    title: {
      text: 'Estamos quase lá! Basta completar os dados para que possamos %STRONG%',
      boldWords: ['finalizar sua emissão'],
    },
  },
];
