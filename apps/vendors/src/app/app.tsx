import { useState } from 'react';
import { ThemeProvider, Themes, Toggle } from 'junto-design-system';
import { useHistory } from 'react-router';
import Routes from './config/routes';
import Header from './presentation/components/Header/Header';
import styles from './app.module.scss';

export function App() {
  const history = useHistory();
  const [showMenuItems, setShowMenuItems] = useState(true);
  const [showBackButton, setShowBackButton] = useState(false);

  return (
    <ThemeProvider theme={Themes.MARSH_THEME}>
      <main className='main'>
        <Header
          showMenuItems={showMenuItems}
          backButton={showBackButton ? () => history.push('/') : undefined}
        />
        <div className={styles.test}>
          <Toggle checked={showMenuItems} onChange={() => setShowMenuItems(!showMenuItems)} name="Mostrar Menu" label='Mostrar Menu'/>
          <Toggle checked={showBackButton} onChange={() => setShowBackButton(!showBackButton)} name="Botão voltar" label='Botão voltar'/>
        </div>
        <Routes />
      </main>
    </ThemeProvider>
  );
}

export default App;
