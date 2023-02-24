import styles from './app.module.scss';
import Routes from './config/routes';

export function App() {
  return (
    <div className={styles.app}>
      <h1>Hello Fidelize Mapeamentos!</h1>
      <Routes />
    </div>
  );
}

export default App;
