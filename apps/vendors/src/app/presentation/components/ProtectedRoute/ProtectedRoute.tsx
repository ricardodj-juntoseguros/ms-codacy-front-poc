import React from 'react';
import { Route, RouteProps, RouteComponentProps } from 'react-router-dom';
import { VendorsAuthService } from '@services';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>;
  allowedRoles?: ('insured' | 'broker' | 'policyholder')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  ...props
}) => {
  const { component: Component, ...rest } = props;
  const vendorsLoginUrl = `${process.env.NX_GLOBAL_VENDORS_PLATFORM_URL}/login`;
  const currentLocationUrl = window.location.href;
  return (
    <Route
      {...rest}
      render={renderProps => {
        const isAuthenticated = VendorsAuthService.isAuthenticated();
        const userType = VendorsAuthService.getUserType();
        if (!isAuthenticated) {
          window.location.assign(`${vendorsLoginUrl}?redirectUrl=${currentLocationUrl}`);
          return null;
        }
        if (!userType || !allowedRoles.includes(userType)) {
          window.location.assign(
            VendorsAuthService.getRedirectPageAfterLogin(),
          );
          return null;
        }
        return <Component {...rest} {...renderProps} />;
      }}
    />
  );
};

export default ProtectedRoute;
