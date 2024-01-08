import { StepComponentModel, StepModel } from "../types";

export const getStepList = (steps: StepComponentModel[]): StepModel[] => {
  return steps.map(step => ({
    name: step.name,
    title: step.title,
    summaryTitle: step.summaryTitle,
    infoText: step.infoText,
    status: step.status,
  }));
};
