import { StepStatusEnum } from '@shared/hooks';
import ValidityAndValueForm from '../../presentation/components/ValidityAndValueForm';
import AdditionalDataForm from '../../presentation/components/AdditionalDataForm';
import InsuredDataBidderForm from '../../presentation/components/InsuredDataBidderForm';

export const BIDDER_STEPS = [
  {
    name: 'ValidityAndValueForm',
    status: StepStatusEnum.HIDDEN,
    component: ValidityAndValueForm,
    summaryTitle: 'Vigência e valor',
    title: {
      text: 'Agora, precisamos dos %STRONG% que a garantia irá cobrir',
      boldWords: ['dados de vigência e valor'],
    },
  },
  {
    name: 'InsuredDataBidderForm',
    status: StepStatusEnum.HIDDEN,
    component: InsuredDataBidderForm,
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
