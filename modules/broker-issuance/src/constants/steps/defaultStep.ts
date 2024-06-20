import { StepStatusEnum } from '@shared/hooks';
import PolicyholderAndModalityForm from '../../presentation/components/PolicyholderAndModalityForm';

export const DEFAULT_STEP = [
  {
    name: 'PolicyholderAndModalityForm',
    status: StepStatusEnum.EDITABLE,
    component: PolicyholderAndModalityForm,
    summaryTitle: 'Dados do tomador e modalidade',
    title: {
      text: 'Para iniciar uma cotação, precisamos do %STRONG% da garantia',
      boldWords: ['nome ou CNPJ do tomador e modalidade'],
    },
  },
];
