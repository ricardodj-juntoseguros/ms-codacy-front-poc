import { StepModel } from "./StepModel";

export interface FlowContextProps {
  steps: StepModel[];
  setSteps(steps: StepModel[]): void;
  setTitle(stepName: string, text: string, boldWords: string[]): void;
  setInfoText(stepName: string, text: string): void;
  advanceStep(stepName: string, infoText?: string): void;
  setEditableStep(stepName: string): void;
}
