import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import IncentiveTrailContainer from '../presentation/pages/IncentiveTrailContainer/IncentiveTrailContainer';

const Routes: React.FC = () => {
  const brokerProcessUrl = process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '';

  return (
    <BrowserRouter basename="campaigns">
      <Switch>
        <Route path="/incentive-trail" component={IncentiveTrailContainer} />
        <Route
          path="*"
          render={() => window.location.assign(brokerProcessUrl)}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
