import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import DashboardContainer from '../presentation/pages/DashboardContainer';
import NoAccessContainer from '../presentation/pages/NoAccessContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="dashboard">
    <Switch>
      <Route path="/" exact component={DashboardContainer} />
      <Route path="/no-access" exact component={NoAccessContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
