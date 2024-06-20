import { StepStatusEnum } from '@shared/hooks';
import PolicyholderAndModalityForm from '../../presentation/components/PolicyholderAndModalityForm';

export const DEFAULT_STEP = [
  {
    name: 'PolicyholderAndModalityForm',
    status: StepStatusEnum.EDITABLE,
    component: PolicyholderAndModalityForm,
    summaryTitle: 'Dados do segurado e proposta',
    title: {
      text: 'Nessa etapa, indique os %STRONG% que irá fazer parte dessa garantia.',
      boldWords: ['dados do segurado'],
    },
  },
];
