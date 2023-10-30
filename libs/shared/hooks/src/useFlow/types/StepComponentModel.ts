import { FunctionComponent } from "react";
import { GenericComponentProps } from "./GenericComponentProps";
import { StepModel } from "./StepModel";

export interface StepComponentModel extends StepModel {
  component: (() => JSX.Element) | FunctionComponent<GenericComponentProps>;
}
