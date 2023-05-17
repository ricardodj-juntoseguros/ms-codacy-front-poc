import { StepComponentModel, StepModel } from '../application/types/model';

export const getStepList = (steps: StepComponentModel[]): StepModel[] => {
  return steps.map(step => ({
    name: step.name,
    title: step.title,
    infoText: step.infoText,
    status: step.status,
  }));
};
