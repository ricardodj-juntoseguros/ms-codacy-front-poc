import styles from './app.module.scss';
import { Button } from 'junto-design-system/src/components/Button';
import { InputBase } from 'junto-design-system/src/components/InputBase';

export function App() {
  return (
    <div className={styles.container}>
      <span>Welcome to plataforma!</span>
      <br />
      <br />
      <Button>Awesome Button</Button>
      <br />
      <br />
      <InputBase
        label="Awesome Input"
        placeholder="Awesome Input"
        icon="eye"
      ></InputBase>
    </div>
  );
}

export default App;
