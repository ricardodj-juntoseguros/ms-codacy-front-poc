import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import VendorsProposal from '@modules/vendors-proposal';
import VendorsAuthentication from '@modules/vendors-authentication';
import Example from '../presentation/pages/Example';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={() => <Redirect to="/login" />}
        />
        <Route path="/login" component={VendorsAuthentication} />
        <Route path="/example" component={Example} />
        <Route path="/proposal" component={VendorsProposal} />
      </Switch>
    </BrowserRouter>
  );
}
