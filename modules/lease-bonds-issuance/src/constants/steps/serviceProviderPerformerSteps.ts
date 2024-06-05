import { StepStatusEnum } from '@shared/hooks';
import ValidityAndValueCoverageLaborForm from '../../presentation/components/ValidityAndValueCoverageLaborForm';
import InsuredDataForm from '../../presentation/components/InsuredDataForm';
import AdditionalDataForm from '../../presentation/components/AdditionalDataForm';

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
    name: 'InsuredDataForm',
    status: StepStatusEnum.HIDDEN,
    component: InsuredDataForm,
    summaryTitle: 'Dados do segurado e proposta',
    title: {
      text: 'Nessa etapa, indique os %STRONG% que irá fazer parte dessa garantia.',
      boldWords: ['dados do segurado'],
    },
  },
  {
    name: 'AdditionalDataForm',
    status: StepStatusEnum.HIDDEN,
    component: AdditionalDataForm,
    summaryTitle: 'Finalizar emissão',

    title: {
      text: 'Estamos quase lá! Basta completar os dados para que possamos %STRONG%',
      boldWords: ['finalizar sua emissão'],
    },
  },
];
