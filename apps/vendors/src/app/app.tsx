import { ThemeProvider, Themes } from 'junto-design-system';
import Routes from './config/routes';

import './app.module.scss';

export function App() {

  return (
    <ThemeProvider theme={Themes.MARSH_THEME}>
      <main>
        <Routes />
      </main>
    </ThemeProvider>
  );
}

export default App;
