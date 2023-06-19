import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { VendorsAuthService } from '@services';
import VendorsProposal from '@modules/vendors-proposal';
import VendorsAuthentication from '@modules/vendors-authentication';
import Example from '../presentation/pages/Example';
import ProtectedRoute from '../presentation/components/ProtectedRoute/ProtectedRoute';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={() => {
            if (VendorsAuthService.isAuthenticated()) {
              return <Redirect to="/proposal" />;
            }
            return <Redirect to="/login" />;
          }}
        />
        <Route path="/login" component={VendorsAuthentication} />
        <ProtectedRoute path="/example" component={Example} />
        <ProtectedRoute path="/proposal" component={VendorsProposal} />
      </Switch>
    </BrowserRouter>
  );
}
