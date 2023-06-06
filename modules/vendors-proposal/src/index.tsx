import { Provider } from 'react-redux';
import { ToastContainer } from 'junto-design-system';
import { useHistory } from 'react-router';
import Routes from './config/routes';
import { store } from './config/store';
import Header from '../../../apps/vendors/src/app/presentation/components/Header';

const VendorsProposal = () => {
  const history = useHistory();
  const backButton = () => history.push('/');

  return (
    <Provider store={store}>
      <Header showMenuItems={false} backButton={backButton}/>
      <Routes />
      <ToastContainer />
    </Provider>
  );
};

export default VendorsProposal;
