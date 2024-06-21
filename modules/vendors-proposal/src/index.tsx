import { Provider } from 'react-redux';
import { ToastContainer } from 'junto-design-system';
import { useEffect } from 'react';
import { VendorsAuthService } from '@services';
import Routes from './config/routes';
import { store } from './config/store';
import { FileProvider } from './config/filesContext';

const VendorsProposal = () => {
  useEffect(() => {
    VendorsAuthService.initInsuredChat();
  }, []);

  return (
    <Provider store={store}>
      <FileProvider>
        <Routes />
        <ToastContainer />
      </FileProvider>
    </Provider>
  );
};

export default VendorsProposal;
