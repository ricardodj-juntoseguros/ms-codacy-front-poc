import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import LeaseBondsIssuance from '@modules/lease-bonds-issuance';
import ProtectedRoute from '../presentation/components/ProtectedRoute/ProtectedRoute';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={() => <Redirect to="/lease-bonds" />}
        />
        <ProtectedRoute path="/lease-bonds" component={LeaseBondsIssuance} />
      </Switch>
    </BrowserRouter>
  );
}
