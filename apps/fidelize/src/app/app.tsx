import styles from './app.module.scss';
import Routes from './config/routes';

export function App() {
  return (
    <div className={styles.app}>
      <Routes />
    </div>
  );
}

export default App;
