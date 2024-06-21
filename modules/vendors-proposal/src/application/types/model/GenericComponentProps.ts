export interface GenericComponentProps {
  handleNextStep: (info: string) => void;
  updateTitle?: (text: string, boldWords: string[]) => void;
}
