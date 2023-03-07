import React from 'react';
import { Route, RouteProps, RouteComponentProps } from 'react-router';
import { BrokerPlatformAuthService } from '@services';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>;
}

const ProtectedRoute = ({
  component: Component,
  ...rest
}: ProtectedRouteProps) => {
  const brokerLoginUrl = process.env.NX_GLOBAL_BROKER_PLATFORM_URL || '';
  const brokerProcessesUrl = process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '';
  const env = process.env.NX_PLAT_ENV || '';
  const currentLocationUrl = window.location.href;

  return (
    <Route
      {...rest}
      render={renderProps => {
        const isAuthenticated = BrokerPlatformAuthService.isAuthenticated();
        const broker = BrokerPlatformAuthService.getBroker();

        if (env !== 'qa' && !isAuthenticated) {
          window.location.assign(
            `${brokerLoginUrl}?redirectUrl=${currentLocationUrl}`,
          );
          return null;
        }

        if (env !== 'qa' && broker?.user.userName !== 'testecorretor_cor') {
          window.location.assign(brokerProcessesUrl);
          return null;
        }

        return <Component {...rest} {...renderProps} />;
      }}
    />
  );
};

export default ProtectedRoute;
