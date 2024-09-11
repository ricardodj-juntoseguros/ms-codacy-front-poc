import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TagManager from 'react-gtm-module';
import App from './app/app';
import { BrowserRouter } from 'react-router-dom';

const gtmArgs = {
  gtmId: process.env.NX_GLOBAL_VENDORS_GTM_KEY || '',
};
TagManager.initialize(gtmArgs);

const container: HTMLElement | null = document.getElementById('root');
if (container === null) throw new Error('Root container missing in index.html');
const root = createRoot(container);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
