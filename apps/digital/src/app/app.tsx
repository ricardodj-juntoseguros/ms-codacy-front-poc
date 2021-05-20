import { InputBase, Button } from '@junto-design-system';
import { StepContainer } from '@libs/shared/ui/step-container/src';
import styles from './app.module.scss';

export function App() {
  return (
    <div className={styles.container}>
      <span>Welcome to digital!</span>
      <StepContainer stepNumber={1} active>
        <Button>Awesome Button</Button>
        <InputBase
          label="Awesome Input"
          placeholder="Awesome Input"
          icon="eye"
        />
      </StepContainer>
    </div>
  );
}

export default App;
