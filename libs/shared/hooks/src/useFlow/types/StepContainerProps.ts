export interface StepContainerProps {
  name: string;
  status: string;
  index: number;
  summaryTitle?: string;
  title: {
    text: string;
    boldWords: string[];
  };
  infoText?: string;
}
