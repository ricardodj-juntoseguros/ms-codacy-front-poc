import { ToastContainer } from 'junto-design-system';
import { VendorsHeader } from '@shared/ui';
import Routes from './config/routes';

const VendorsPolicies = () => {
  return (
    <>
      <VendorsHeader />
      <Routes />
      <ToastContainer />
    </>
  );
};

export default VendorsPolicies;
