import { StepModel } from '../application/types/model';

export function getStepByName(name: string, steps: StepModel[]) {
  return steps.find(step => step.name === name);
}
