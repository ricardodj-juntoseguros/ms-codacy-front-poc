import { FunctionComponent } from 'react';
import { StepComponentModel } from "./StepComponentModel";
import { StepContainerProps } from "./StepContainerProps";
import { StepModel } from "./StepModel";

export interface FlowProviderProps {
  initialSteps: StepModel[];
  allSteps: StepComponentModel[];
  showFinishedSteps?: boolean;
  ComponentContainer?:
  | (() => JSX.Element)
  | FunctionComponent<StepContainerProps>;
}
