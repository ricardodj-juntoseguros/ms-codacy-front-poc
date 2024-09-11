import { Routes as DomRoutes, Route, Navigate } from 'react-router-dom';
import VendorsProposal from '@modules/vendors-proposal';
import VendorsAuthentication from '@modules/vendors-authentication';
import VendorsPolicies from '@modules/vendors-policies';
import VendorsPreApproval from '@modules/vendors-pre-approval';
import ProtectedRoute from '../presentation/components/ProtectedRoute';

export default function Routes() {
  return (
    <DomRoutes>
      <Route path="/" element={<Navigate to="/policies" replace />} />
      <Route path="/login" element={<VendorsAuthentication />} />
      <Route
        element={
          <ProtectedRoute
            allowedRoles={['insured', 'broker', 'policyholder']}
          />
        }
      >
        <Route path="/policies" element={<VendorsPolicies />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['insured']} />}>
        <Route path="/proposal" element={<VendorsProposal />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['policyholder']} />}>
        <Route path="/pre-approval" element={<VendorsPreApproval />} />
      </Route>
      <Route path="*" element={<Navigate to="/policies" />} />
    </DomRoutes>
  );
}
