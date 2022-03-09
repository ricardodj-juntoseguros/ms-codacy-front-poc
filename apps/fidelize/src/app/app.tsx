import styles from './app.module.scss';
import Routes from './config/routes';
import Header from './presentation/components/Header';

export function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Routes />
    </div>
  );
}

export default App;
