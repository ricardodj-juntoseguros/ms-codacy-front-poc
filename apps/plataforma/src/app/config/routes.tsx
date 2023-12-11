import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import BrokerIssuance from '@modules/broker-issuance';
import BrokerSignupDirect from '@modules/broker-signup-direct';
import ProtectedRoute from '../presentation/components/ProtectedRoute/ProtectedRoute';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={() => <Redirect to="/proposal" />}
        />
        <ProtectedRoute path="/proposal" component={BrokerIssuance} />
        <Route path="/signup" component={BrokerSignupDirect} />
      </Switch>
    </BrowserRouter>
  );
}
