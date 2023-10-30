import { StepStatusEnum } from "../enums/StepStatusEnum";

export interface StepModel {
  name: string;
  status: StepStatusEnum;
  title: {
    text: string;
    boldWords: string[];
  };
  infoText?: string;
}
