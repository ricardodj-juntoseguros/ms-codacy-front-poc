import { StepStatusEnum } from '@shared/hooks';
import ValidityAndValueForm from '../../presentation/components/ValidityAndValueForm';

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
];
