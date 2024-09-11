/* eslint-disable react/require-default-props */
import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { VendorsAuthService } from '@services';

interface ProtectedRouteProps {
  allowedRoles?: ('insured' | 'broker' | 'policyholder')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
}) => {
  const location = useLocation();
  const currentLocationUrl = window.location.href;
  const isAuthenticated = VendorsAuthService.isAuthenticated();
  const userType = VendorsAuthService.getUserType();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          search: `?redirectUrl=${currentLocationUrl}`,
        }}
      />
    );
  }

  if (
    !userType ||
    (allowedRoles.length !== 0 && !allowedRoles.includes(userType))
  ) {
    window.location.assign(VendorsAuthService.getRedirectPageAfterLogin());
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
