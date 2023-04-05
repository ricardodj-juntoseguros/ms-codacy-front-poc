import React from 'react';
import { Route, RouteProps, RouteComponentProps } from 'react-router-dom';
import { BackofficeAuthService } from '@services';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>;
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { component: Component, ...rest } = props;
  const backofficeLoginUrl =
    process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL || '';
  const backofficeHomeUrl = `${process.env.NX_GLOBAL_BACKOFFICE_PLATFORM_URL}/home`;

  return (
    <Route
      {...rest}
      render={renderProps => {
        const isAuthenticated = BackofficeAuthService.isAuthenticated();
        const hasOpportunityRequest =
          BackofficeAuthService.getUserHasOpportunityRequest();
        if (!isAuthenticated) {
          window.location.assign(`${backofficeLoginUrl}`);
          return null;
        }
        if (!hasOpportunityRequest) {
          window.location.assign(backofficeHomeUrl);
          return null;
        }
        return <Component {...rest} {...renderProps} />;
      }}
    />
  );
};

export default ProtectedRoute;
