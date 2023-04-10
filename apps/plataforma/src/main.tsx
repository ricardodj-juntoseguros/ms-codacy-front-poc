import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import LogRocket from 'logrocket';
import App from './app/app';


if(process.env.NX_GLOBAL_ENVIROMENT === 'prd'){
  LogRocket.init(process.env.NX_LOGROCKET_KEY || '', {
    rootHostname: process.env.NX_APP_DOMAIN,
    network: {
      requestSanitizer: request => {
      return request;
      }
    }
  });
}
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
