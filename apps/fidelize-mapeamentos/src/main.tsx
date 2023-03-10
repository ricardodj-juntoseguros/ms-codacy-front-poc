import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BackofficeAuthService } from '@services';
import App from './app/app';

// Initialize user storage session from cookie
BackofficeAuthService.saveTokenAndUserFromAccessCookie();
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
