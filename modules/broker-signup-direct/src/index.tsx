import { Provider } from 'react-redux';
import TagManager from 'react-gtm-module';
import { useEffect } from 'react';
import Routes from './config/routes';
import { store } from './config/store';

function BrokerSignupDirect() {
  useEffect(() => {
    console.log(
      `start tagmManager${process.env.NX_PLATAFORM_GTM_KEY_GA_FLOW_SIGNUP}`,
    );
    const gtmArgs = {
      gtmId: process.env.NX_PLATAFORM_GTM_KEY_GA_FLOW_SIGNUP || 'GTM-NNJCMZJN',
    };
    TagManager.initialize(gtmArgs);
  });

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}

export default BrokerSignupDirect;
