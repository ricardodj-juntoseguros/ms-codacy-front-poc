import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { VendorsAuthService } from '@services';
import VendorsProposal from '@modules/vendors-proposal';
import VendorsAuthentication from '@modules/vendors-authentication';
import VendorsPolicies from '@modules/vendors-policies';
import VendorsPreApproval from '@modules/vendors-pre-approval';

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
              return <Redirect to="/policies" />;
            }
            return <Redirect to="/login" />;
          }}
        />
        <Route path="/login" component={VendorsAuthentication} />
        <ProtectedRoute
          path="/proposal"
          component={VendorsProposal}
          allowedRoles={['insured']}
        />
        <ProtectedRoute
          path="/policies"
          component={VendorsPolicies}
          allowedRoles={['insured', 'broker', 'policyholder']}
        />
        <ProtectedRoute
          path="/pre-approval"
          component={VendorsPreApproval}
          allowedRoles={['policyholder']}
        />
      </Switch>
    </BrowserRouter>
  );
}
