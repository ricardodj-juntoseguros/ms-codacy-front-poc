import { StepStatusEnum } from '@shared/hooks';
import PolicyholderAndModalityWithRenewalForm from '../../presentation/components/PolicyholderAndModalityWithRenewalForm';

export const DEFAULT_STEP_WITH_RENEWAL = [
  {
    name: 'PolicyholderAndModalityWithRenewalForm',
    status: StepStatusEnum.EDITABLE,
    component: PolicyholderAndModalityWithRenewalForm,
    summaryTitle: 'Dados do tomador e modalidade',
    title: {
      text: 'Para iniciar uma cotação, precisamos do %STRONG% da garantia',
      boldWords: ['nome ou CNPJ do tomador e modalidade'],
    },
  },
];
