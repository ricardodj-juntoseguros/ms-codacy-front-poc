import { Button } from "junto-design-system";

const Component = (props: any) => {
  return (
    <>
      <h1>Component</h1>
      <Button onClick={() => props.handleNextStep('Component')}>next</Button>
    </>
  );
};

export const getComponentMock = () => {
  return Component;
}
