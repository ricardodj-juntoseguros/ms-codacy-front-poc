import { FunctionComponent } from 'react';
import { StepStatusEnum } from './StepStatusEnum';
import { GenericComponentProps } from './GenericComponentProps';

export interface StepComponentModel extends StepModel {
  component: (() => JSX.Element) | FunctionComponent<GenericComponentProps>;
}

export interface StepModel {
  name: string;
  status: StepStatusEnum;
  title: {
    text: string;
    boldWords: string[];
  };
  infoText?: string;
}
