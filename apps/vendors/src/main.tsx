import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import TagManager from 'react-gtm-module';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';

const gtmArgs = {
  gtmId: process.env.NX_GLOBAL_VENDORS_GTM_KEY || '',
};
TagManager.initialize(gtmArgs);

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root'),
);
