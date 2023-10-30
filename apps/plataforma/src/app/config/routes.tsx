import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import BrokerIssuance from '@modules/broker-issuance';
import BrokerSignup from '@modules/broker-signup';

import BrokerSignupDirect from '@modules/broker-signup-direct';
import ProtectedRoute from '../presentation/components/ProtectedRoute/ProtectedRoute';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={() => <Redirect to="/emissao" />}
        />
        <ProtectedRoute path="/emissao" component={BrokerIssuance} />
        <Route path="/signup" component={BrokerSignup} />
        <ProtectedRoute path="/direct" component={BrokerSignupDirect} />
      </Switch>
    </BrowserRouter>
  );
}
