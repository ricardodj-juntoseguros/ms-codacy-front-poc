import { Provider } from 'react-redux';
import Routes from './config/routes';
import { store } from './config/store';

function FidelizeDashboard() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}

export default FidelizeDashboard;
