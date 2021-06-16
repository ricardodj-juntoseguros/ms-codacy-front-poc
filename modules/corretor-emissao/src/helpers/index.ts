import { StepModel, ModalityTypeEnum } from '../application/types/model';

export function currencyFormatter(value: number) {
  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return `${amount}`;
}

export function getStepByName(name: string, steps: StepModel[]) {
  return steps.find(step => step.name === name);
}

export function getModalityType(modalityId: number): ModalityTypeEnum | null {
  switch (modalityId) {
    case 3:
      return ModalityTypeEnum.EXECUTANTE_CONSTRUTOR;
    default:
      return null;
  }
}
