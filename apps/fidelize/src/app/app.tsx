import styles from './app.module.scss';
import Routes from './config/routes';

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.app__header}>
        <h1>Bem-Vindo ao fidelize!</h1>
      </header>
      <Routes />
    </div>
  );
}

export default App;
