export interface StepContainerProps {
  name: string;
  status: string;
  index: number;
  title: {
    text: string;
    boldWords: string[];
  };
  infoText?: string;
}
