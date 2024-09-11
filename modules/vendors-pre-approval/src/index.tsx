import { ToastContainer } from 'junto-design-system';
import { VendorsHeader } from '@shared/ui';
import { useNavigate } from 'react-router-dom';
import Routes from './config/routes';

const VendorsPreApproval = () => {
  const navigate = useNavigate();

  return (
    <>
      <VendorsHeader
        showMenuItems={false}
        backButton={() => {
          navigate('/');
        }}
      />
      <Routes />
      <ToastContainer duration={2000} position="top-right" />
    </>
  );
};

export default VendorsPreApproval;
