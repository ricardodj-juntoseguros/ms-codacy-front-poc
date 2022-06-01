import React from 'react';
import { StepModel } from './StepModel';

interface ModalityStepModel extends StepModel {
  Component: (() => JSX.Element) | React.FC;
}

export interface Modalities {
  [x: string]: {
    validationSchema: string;
    steps: ModalityStepModel[];
  };
}
