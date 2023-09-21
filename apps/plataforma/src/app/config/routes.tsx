import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import CorretorEmissao from '@modules/corretor-emissao';
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
        <ProtectedRoute path="/emissao" component={CorretorEmissao} />
        <Route path="/signup" component={BrokerSignup} />
        <ProtectedRoute path="/direct" component={BrokerSignupDirect} />
      </Switch>
    </BrowserRouter>
  );
}
