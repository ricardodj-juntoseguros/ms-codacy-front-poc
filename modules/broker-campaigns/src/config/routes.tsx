import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import IncentiveTrailContainer from '../presentation/pages/IncentiveTrailContainer/IncentiveTrailContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="campaigns">
    <Switch>
      <Route path="/incentive-trail" component={IncentiveTrailContainer} />
      <Route path="*" component={IncentiveTrailContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
