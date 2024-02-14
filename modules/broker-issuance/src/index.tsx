import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { clarity } from 'react-microsoft-clarity';
import Routes from './config/routes';
import { store } from './config/store';

function BrokerIssuance() {
  useEffect(() => {
    if (process.env.NX_GLOBAL_ENVIROMENT === 'prd') {
      clarity.init(process.env.NX_GLOBAL_CLARITY_ID_BROKER_ISSUANCE || '');
    }
  }, []);

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}

export default BrokerIssuance;
