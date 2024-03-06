import { ToastContainer } from 'junto-design-system';
import { VendorsHeader } from '@shared/ui';
import { useEffect } from 'react';
import { VendorsAuthService } from '@services';
import Routes from './config/routes';

const VendorsPolicies = () => {
  useEffect(() => {
    VendorsAuthService.initInsuredChat();
  }, []);
  return (
    <>
      <VendorsHeader />
      <Routes />
      <ToastContainer />
    </>
  );
};

export default VendorsPolicies;
