import { StepModel } from './StepModel';

interface ModalityStepModel extends StepModel {
  Component: () => JSX.Element;
}

export interface Modalities {
  [x: string]: {
    steps: ModalityStepModel[];
  };
}
