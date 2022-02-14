import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import DashboardContainer from '../presentation/pages/DashboardContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="dashboard">
    <Switch>
      <Route path="/" exact component={DashboardContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
