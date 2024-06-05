import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import LogRocket from 'logrocket';
import TagManager from 'react-gtm-module';
import App from './app/app';

if (process.env.NX_GLOBAL_ENVIROMENT === 'prd') {
  LogRocket.init(process.env.NX_LOGROCKET_KEY || '', {
    rootHostname: process.env.NX_APP_DOMAIN,
    network: {
      requestSanitizer: request => {
        return request;
      },
    },
  });
}

const gtmArgs = {
  gtmId: process.env.NX_PLATAFORM_GTM_KEY || '',
};
TagManager.initialize(gtmArgs);

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
