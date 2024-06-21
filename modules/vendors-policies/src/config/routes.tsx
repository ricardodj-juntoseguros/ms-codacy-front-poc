import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ProcessListContainer from '../presentation/pages/ProcessListContainer';
import ProcessDetailsContainer from '../presentation/pages/ProcessDetailsContainer';

const Routes: React.FC = () => (
  <BrowserRouter basename="policies">
    <Switch>
      <Route path="/" exact component={ProcessListContainer} />
      <Route
        path="/details/:proposalId"
        exact
        component={ProcessDetailsContainer}
      />
    </Switch>
  </BrowserRouter>
);

export default Routes;
