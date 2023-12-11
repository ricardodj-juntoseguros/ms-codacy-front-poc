import { StepStatusEnum } from '@shared/hooks';
import ValidityAndValueForm from '../../presentation/components/ValidityAndValueForm';
import InsuredDataForm from '../../presentation/components/InsuredDataForm';

export const COMMON_STEPS = [
  {
    name: 'ValidityAndValueForm',
    status: StepStatusEnum.HIDDEN,
    component: ValidityAndValueForm,
    title: {
      text: 'Agora, precisamos dos %STRONG% que a garantia irá cobrir',
      boldWords: ['dados de vigência e valor'],
    },
  },
  {
    name: 'InsuredDataForm',
    status: StepStatusEnum.HIDDEN,
    component: InsuredDataForm,
    title: {
      text: 'Nessa etapa, indique os %STRONG% que irá fazer parte dessa garantia.',
      boldWords: ['dados do segurado'],
    },
  }
];
