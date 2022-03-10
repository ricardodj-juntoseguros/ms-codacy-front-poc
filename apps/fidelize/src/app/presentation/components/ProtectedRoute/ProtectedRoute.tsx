import React from 'react';
import { Route, RouteProps, RouteComponentProps } from 'react-router';
import { BrokerPlatformAuthService } from '@services';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>;
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { component: Component, ...rest } = props;
  const brokerLoginUrl = process.env.NX_GLOBAL_BROKER_PLATFORM_URL || '';
  const brokerProcessesUrl = process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '';
  const appUrl = process.env.NX_FID_APP_URL || '';

  return (
    <Route
      {...rest}
      render={renderProps => {
        const isAuthenticated = BrokerPlatformAuthService.isAuthenticated();
        const isBroker = BrokerPlatformAuthService.isBroker();
        if (!isAuthenticated) {
          window.location.assign(`${brokerLoginUrl}?redirectUrl=${appUrl}`);
          return null;
        }
        if (!isBroker) {
          window.location.assign(brokerProcessesUrl);
          return null;
        }
        return <Component {...rest} {...renderProps} />;
      }}
    />
  );
};

export default ProtectedRoute;
