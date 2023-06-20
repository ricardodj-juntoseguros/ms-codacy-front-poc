import { Provider } from 'react-redux';
import { ToastContainer } from 'junto-design-system';
import { useHistory } from 'react-router';
import Routes from './config/routes';
import { store } from './config/store';
import Header from '../../../apps/vendors/src/app/presentation/components/Header';
import { FileProvider } from './config/filesContext';
import { URLS_WITHOUT_HEADER } from './constants';

const VendorsProposal = () => {
  const history = useHistory();
  const backButton = () => history.push('/');

  return (
    <Provider store={store}>
      <FileProvider>
        {!URLS_WITHOUT_HEADER.includes(history.location.pathname) && (
          <Header showMenuItems={false} backButton={backButton} />
        )}
        <Routes />
        <ToastContainer />
      </FileProvider>
    </Provider>
  );
};

export default VendorsProposal;
