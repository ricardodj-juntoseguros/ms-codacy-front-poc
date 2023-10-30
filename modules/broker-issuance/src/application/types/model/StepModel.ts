export interface StepModel {
  name: string;
  number: number;
  isActive: boolean;
  isVisible: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  isCompleted: boolean;
  nextStep: string;
}
