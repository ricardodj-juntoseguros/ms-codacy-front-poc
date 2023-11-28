import { StepStatusEnum } from "@shared/hooks";
import PolicyholderAndModalityForm from "../../presentation/components/PolicyholderAndModalityForm/PolicyholderAndModalityForm";

export const COMMON_STEP = [
  {
    name: 'PolicyholderAndModalityForm',
    status: StepStatusEnum.EDITABLE,
    component: PolicyholderAndModalityForm,
    title: {
      text: 'Para iniciar uma cotação, precisamos do %STRONG% da garantia',
      boldWords: ['nome ou CNPJ do tomador e modalidade'],
    },
  },
]
