import { Provider } from 'react-redux';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';
import { clarity } from 'react-microsoft-clarity';
import Routes from './config/routes';
import { store } from './config/store';

function BrokerSignupDirect() {
  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'zenDeskChatInit',
      },
    });
    const gtmArgs = {
      gtmId: process.env.NX_PLATAFORM_GTM_KEY_GA_FLOW_SIGNUP || 'GTM-NNJCMZJN',
    };
    TagManager.initialize(gtmArgs);
  });

  useEffect(() => {
    if (process.env.NX_GLOBAL_ENVIROMENT === 'prd') {
      clarity.init(process.env.NX_GLOBAL_CLARITY_ID_SIGNUP || '');
    }
  });

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}

export default BrokerSignupDirect;
