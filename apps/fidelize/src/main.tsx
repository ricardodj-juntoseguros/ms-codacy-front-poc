import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import TagManager from 'react-gtm-module';
import { BrokerPlatformAuthService } from '@services';

import App from './app/app';

const userData = BrokerPlatformAuthService.getUserAccessCookie() || {
  broker: { externalId: 'Unknown', userId: 'Unknown' },
};
const gtmArgs = {
  gtmId: process.env.NX_FID_GTM_KEY || '',
  dataLayer: {
    userId: userData.broker.userId,
    brokerId: userData.broker.externalId,
  },
};
TagManager.initialize(gtmArgs);

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
