import { ThemeProvider, Themes } from 'junto-design-system';
import { useHistory } from 'react-router';
import Routes from './config/routes';
import Header from './presentation/components/Header/Header';

import './app.module.scss';

export function App() {
  const history = useHistory();

  return (
    <ThemeProvider theme={Themes.MARSH_THEME}>
      <main>
        <Header
          showMenuItems={false}
          backButton={ () => history.push('/')}
        />
        <Routes />
      </main>
    </ThemeProvider>
  );
}

export default App;
