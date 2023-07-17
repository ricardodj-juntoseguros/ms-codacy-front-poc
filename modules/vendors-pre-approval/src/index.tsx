import { ToastContainer } from 'junto-design-system';
import { VendorsHeader } from '@shared/ui';
import { useHistory } from 'react-router';
import Routes from './config/routes';

const VendorsPreApproval = () => {
  const history = useHistory();

  return (
    <>
      <VendorsHeader
        showMenuItems={false}
        backButton={() => {
          history.push('/');
        }}
      />
      <Routes />
      <ToastContainer duration={2000} position="top-right" />
    </>
  );
};

export default VendorsPreApproval;
