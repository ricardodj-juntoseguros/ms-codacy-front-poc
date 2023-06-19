import React from 'react';
import { Route, RouteProps, RouteComponentProps } from 'react-router-dom';
import { VendorsAuthService } from '@services';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>;
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { component: Component, ...rest } = props;
  const vendorsLoginUrl = `${process.env.NX_GLOBAL_VENDORS_PLATFORM_URL}/login`;
  return (
    <Route
      {...rest}
      render={renderProps => {
        const isAuthenticated = VendorsAuthService.isAuthenticated();
        if (!isAuthenticated) {
          window.location.assign(`${vendorsLoginUrl}`);
          return null;
        }
        return <Component {...rest} {...renderProps} />;
      }}
    />
  );
};

export default ProtectedRoute;
