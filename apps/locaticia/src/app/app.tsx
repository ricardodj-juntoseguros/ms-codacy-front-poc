import { ThemeProvider, Themes, ToastContainer } from 'junto-design-system';
import Routes from './config/routes';

import './app.module.scss';

export function App() {
  return (
    <ThemeProvider theme={Themes.DEFAULT}>
      <main>
        <Routes />
      </main>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
