import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import FlowContainer from '../presentation/pages/FlowContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="proposal">
    <Switch>
      <Route path="/" exact component={FlowContainer} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
