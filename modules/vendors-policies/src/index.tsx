import { Provider } from 'react-redux';
import { ToastContainer } from 'junto-design-system';
import { VendorsHeader } from '@shared/ui';
import Routes from './config/routes';
import { store } from './config/store';

const VendorsPolicies = () => {
  return (
    <Provider store={store}>
      <VendorsHeader />
      <Routes />
      <ToastContainer />
    </Provider>
  );
};

export default VendorsPolicies;
