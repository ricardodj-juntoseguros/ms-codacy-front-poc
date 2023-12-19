import { StepStatusEnum } from '@shared/hooks';
import PolicyholderAndModalityForm from '../../presentation/components/PolicyholderAndModalityForm';
import InsuredDataForm from '../../presentation/components/InsuredDataForm';

export const DEFAULT_STEP = [
  {
    name: 'PolicyholderAndModalityForm',
    status: StepStatusEnum.EDITABLE,
    component: PolicyholderAndModalityForm,
    title: {
      text: 'Para iniciar uma cotação, precisamos do %STRONG% da garantia',
      boldWords: ['nome ou CNPJ do tomador e modalidade'],
    },
  },
  // {
  //   name: 'InsuredDataForm',
  //   status: StepStatusEnum.EDITABLE,
  //   component: InsuredDataForm,
  //   title: {
  //     text: 'Nessa etapa, indique os %STRONG% que irá fazer parte dessa garantia.',
  //     boldWords: ['dados do segurado'],
  //   },
  // }
];
