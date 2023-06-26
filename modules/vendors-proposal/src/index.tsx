import { Provider } from 'react-redux';
import { ToastContainer } from 'junto-design-system';
import Routes from './config/routes';
import { store } from './config/store';
import { FileProvider } from './config/filesContext';

const VendorsProposal = () => {
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
