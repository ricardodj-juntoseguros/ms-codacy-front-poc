import { Provider } from 'react-redux';
import { ToastContainer } from 'junto-design-system';
import Routes from './config/routes';
import { store } from './config/store';

const VendorsProposal = () => {
  return (
    <Provider store={store}>
      <Routes />
      <ToastContainer />
    </Provider>
  );
};

export default VendorsProposal;
