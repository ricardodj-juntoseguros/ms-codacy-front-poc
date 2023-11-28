import { FunctionComponent } from 'react';
import { StepComponentModel } from "./StepComponentModel";
import { StepContainerProps } from "./StepContainerProps";

export interface FlowProviderProps {
  initialSteps: StepComponentModel[];
  allSteps: StepComponentModel[];
  showFinishedSteps?: boolean;
  ComponentContainer?:
  | (() => JSX.Element)
  | FunctionComponent<StepContainerProps>;
}
