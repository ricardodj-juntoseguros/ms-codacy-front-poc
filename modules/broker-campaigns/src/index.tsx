import { useEffect } from 'react';
import { clarity } from 'react-microsoft-clarity';
import Routes from './config/routes';

function BrokerCampaigns() {
  useEffect(() => {
    if (process.env.NX_GLOBAL_ENVIROMENT === 'prd') {
      clarity.init(process.env.NX_GLOBAL_CLARITY_ID_BROKER_ISSUANCE || '');
    }
  }, []);

  return <Routes />;
}

export default BrokerCampaigns;
