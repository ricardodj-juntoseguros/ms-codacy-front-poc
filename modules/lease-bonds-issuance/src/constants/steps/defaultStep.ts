import { StepStatusEnum } from '@shared/hooks';
import LeaseBondsForm from '../../presentation/components/LeaseBondsForm';

export const DEFAULT_STEP = [
  {
    name: 'LeaseBondsForm',
    status: StepStatusEnum.EDITABLE,
    component: LeaseBondsForm,
    summaryTitle: 'Teste',
    title: {
      text: 'Para começar, precisamos dos %STRONG%',
      boldWords: ['dados da locação'],
    },
  },
];
