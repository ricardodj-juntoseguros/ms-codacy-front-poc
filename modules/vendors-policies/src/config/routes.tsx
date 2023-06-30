import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ProcessListContainer from '../presentation/pages/ProcessListContainer';
import ProcessDetails from '../presentation/pages/ProcessDetails/ProcessDetails';

const Routes: React.FC = () => (
  <BrowserRouter basename="policies">
    <Switch>
      <Route path="/" exact component={ProcessListContainer} />
      <Route path="/details/:proposalId" exact component={ProcessDetails} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
